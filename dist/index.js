/**
 * Generador de Códigos de Barras 🏷️
 * Plugin Oficial de SERA v4
 *
 * Dibuja de forma interactiva e interactúa con códigos de barras numéricos de forma 100% offline.
 * Transforma celdas con códigos en botones interactivos y abre el visualizador de barra.
 */

(function () {
  'use strict';

  if (typeof window.SeraAPI === 'undefined') {
    console.error('[Códigos de Barras] window.SeraAPI no está disponible.');
    return;
  }

  const api = window.SeraAPI;
  const PLUGIN_ID = 'sera-plugin-barcode';

  // Abre el modal interactivo de visualización de código de barras
  window.SeraAPI_barcode_show = function (valString) {
    // Limpiar modal anterior si existiera
    const modalExistente = document.getElementById('barcode-render-modal');
    if (modalExistente) modalExistente.remove();

    // Generar franjas estéticas basadas en el código
    const stripes = [];
    // Guardas de inicio (estándar)
    stripes.push('<div class="barcode-stripe w-thin"></div>');
    stripes.push('<div class="barcode-stripe space-thin"></div>');
    stripes.push('<div class="barcode-stripe w-thin"></div>');

    for (let i = 0; i < valString.length; i++) {
      const charCode = valString.charCodeAt(i);
      const mod = charCode % 4;

      if (mod === 0) {
        stripes.push('<div class="barcode-stripe w-thin"></div>');
        stripes.push('<div class="barcode-stripe space-medium"></div>');
        stripes.push('<div class="barcode-stripe w-medium"></div>');
        stripes.push('<div class="barcode-stripe space-thin"></div>');
      } else if (mod === 1) {
        stripes.push('<div class="barcode-stripe w-medium"></div>');
        stripes.push('<div class="barcode-stripe space-thin"></div>');
        stripes.push('<div class="barcode-stripe w-thin"></div>');
        stripes.push('<div class="barcode-stripe space-medium"></div>');
      } else if (mod === 2) {
        stripes.push('<div class="barcode-stripe w-thick"></div>');
        stripes.push('<div class="barcode-stripe space-thin"></div>');
        stripes.push('<div class="barcode-stripe w-medium"></div>');
        stripes.push('<div class="barcode-stripe space-thin"></div>');
      } else {
        stripes.push('<div class="barcode-stripe w-thin"></div>');
        stripes.push('<div class="barcode-stripe space-thick"></div>');
        stripes.push('<div class="barcode-stripe w-thick"></div>');
        stripes.push('<div class="barcode-stripe space-thin"></div>');
      }
    }

    // Guardas de fin
    stripes.push('<div class="barcode-stripe w-thin"></div>');
    stripes.push('<div class="barcode-stripe space-thin"></div>');
    stripes.push('<div class="barcode-stripe w-thin"></div>');

    const overlay = document.createElement('div');
    overlay.className = 'barcode-modal-overlay';
    overlay.id = 'barcode-render-modal';

    overlay.innerHTML = `
      <div class="barcode-modal">
        <div class="barcode-modal-header">
          <span class="modal-icon">🏷️</span>
          <h3>Código de Barras Generado</h3>
        </div>
        <div class="barcode-graphics-container">
          <div class="barcode-stripes-row">
            ${stripes.join('')}
          </div>
          <p class="barcode-value-label">${valString}</p>
        </div>
        <div class="barcode-modal-footer">
          <button id="barcode-btn-close-modal">Aceptar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('barcode-btn-close-modal').addEventListener('click', () => {
      overlay.remove();
    });
  };

  // 1. REGISTRAR CELL RENDERERS PARA COLUMNAS RELACIONADAS A CÓDIGOS DE BARRA
  const columnasBarras = ['barcode', 'codigo_barra', 'ean13', 'sku', 'codigo_producto', 'upc'];

  columnasBarras.forEach((colName) => {
    api.ui.registerCellRenderer(colName, (value) => {
      if (!value) return '<span style="opacity:0.3">—</span>';
      
      const cleanVal = String(value).replace(/'/g, "\\'").replace(/"/g, '&quot;');
      
      return `
        <span 
          class="badge-barcode-btn"
          onclick="window.SeraAPI_barcode_show('${cleanVal}')"
          title="Click para ver código de barras offline"
        >
          🏷️ Barcode: ${value}
        </span>
      `;
    });
  });

  // Notificación de carga
  api.env.showNotification('🧩 Generador de Códigos de Barras cargado correctamente', 'info');
  console.log('[Código de Barras] Plugin inicializado correctamente ✅');

})();
