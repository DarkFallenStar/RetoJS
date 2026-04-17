// ============================================================
//  Papelería Papel y Luna — Google Apps Script
//  Hoja "productos":        id | nombre | precio | stock | costo | categoria | imagen
//  Hoja "ventas":           id | fecha | metodo | total | cambio | items | cliente
//  Hoja "clientes":         id | nombre | telefono | correo
//  Hoja "ventas_guardadas": id | fecha | total | items | cliente
// ============================================================

function doGet(e) {
  try {
    var resource = e.parameter.resource;
    if (!resource) return resp({ success: false, message: "Falta resource" });
    return getSheetData(resource);
  } catch (err) {
    return resp({ success: false, message: err.message });
  }
}

function doPost(e) {
  try {
    var resource = e.parameter.resource;
    if (!resource) return resp({ success: false, message: "Falta resource" });
    var data = JSON.parse(e.postData.contents);

    if (resource === "productos")        return handleProducto(data);
    if (resource === "ventas")           return appendRow("ventas", data);
    if (resource === "clientes")         return appendRow("clientes", data);
    if (resource === "ventas_guardadas") return handleVentaGuardada(data);

    return resp({ success: false, message: "Resource desconocido: " + resource });
  } catch (err) {
    return resp({ success: false, message: err.message });
  }
}

function handleProducto(data) {
  var action = data.action;
  if (action === "create") return appendRow("productos", data);
  if (action === "update") {
    var sheet = getSheet("productos"), values = sheet.getDataRange().getValues();
    var headers = values[0], idCol = headers.indexOf("id");
    if (idCol === -1) return resp({ success: false, message: "Columna id no encontrada" });
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][idCol]) === String(data.id)) {
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([buildRow(headers, data)]);
        return resp({ success: true });
      }
    }
    return resp({ success: false, message: "Producto no encontrado: " + data.id });
  }
  if (action === "delete") {
    var sheet = getSheet("productos"), values = sheet.getDataRange().getValues();
    var headers = values[0], idCol = headers.indexOf("id");
    if (idCol === -1) return resp({ success: false, message: "Columna id no encontrada" });
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][idCol]) === String(data.id)) { sheet.deleteRow(i + 1); return resp({ success: true }); }
    }
    return resp({ success: false, message: "Producto no encontrado: " + data.id });
  }
  return resp({ success: false, message: "Accion desconocida: " + action });
}

function handleVentaGuardada(data) {
  // Sin action = guardar nueva fila
  if (!data.action) return appendRow("ventas_guardadas", data);

  if (data.action === "update") {
    var sheet = getSheet("ventas_guardadas"), values = sheet.getDataRange().getValues();
    var headers = values[0], idCol = headers.indexOf("id");
    if (idCol === -1) return resp({ success: false, message: "Columna id no encontrada en ventas_guardadas" });
    // Normalizar el id buscado: convertir a string y quitar decimales si viene como número
    var idBuscado = String(data.id).replace(/\.0$/, "");
    for (var i = 1; i < values.length; i++) {
      var idFila = String(values[i][idCol]).replace(/\.0$/, "");
      if (idFila === idBuscado) {
        var dataToSave = {};
        for (var key in data) { if (key !== "action") dataToSave[key] = data[key]; }
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([buildRow(headers, dataToSave)]);
        return resp({ success: true });
      }
    }
    return resp({ success: false, message: "Venta guardada no encontrada para update: " + data.id });
  }

  if (data.action === "delete") {
    var sheet = getSheet("ventas_guardadas"), values = sheet.getDataRange().getValues();
    var headers = values[0], idCol = headers.indexOf("id");
    if (idCol === -1) return resp({ success: false, message: "Columna id no encontrada en ventas_guardadas" });
    var idBuscado = String(data.id).replace(/\.0$/, "");
    for (var i = 1; i < values.length; i++) {
      var idFila = String(values[i][idCol]).replace(/\.0$/, "");
      if (idFila === idBuscado) { sheet.deleteRow(i + 1); return resp({ success: true }); }
    }
    return resp({ success: false, message: "Venta guardada no encontrada: " + data.id });
  }

  return resp({ success: false, message: "Accion desconocida: " + data.action });
}

function appendRow(sheetName, data) {
  var sheet = getSheet(sheetName);
  var headers = sheet.getDataRange().getValues()[0];
  sheet.appendRow(buildRow(headers, data));
  return resp({ success: true });
}

function getSheetData(sheetName) {
  var sheet = getSheet(sheetName), values = sheet.getDataRange().getValues();
  var headers = values[0], data = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) row[headers[j]] = values[i][j];
    data.push(row);
  }
  return resp({ success: true, data: data });
}

function buildRow(headers, data) {
  return headers.map(function(key) {
    var val = data[key];
    if (val === undefined || val === null) return "";
    if (typeof val === "object") return JSON.stringify(val);
    return val;
  });
}

function getSheet(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error("Hoja no encontrada: " + name);
  return sheet;
}

function resp(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
