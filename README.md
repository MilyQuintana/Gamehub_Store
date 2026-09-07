GAMEHUB STORE - FRONTEND(EP1)

Integrantes :

Emily Pacheco 
Benjamin Leiva

DESCRIPCIÓN:

GameHub Store es una tienda gamer en línea. Este repositorio contiene la capa de presentacion del sitio: 
-Carpeta que contiene las 6 vistas HTML enlazadas por hipervinculos.
-Una carpeta con una hoja de estilos CSS externa(Paleta 4. Neon de tienda)
-Carpeta que contiene los archivos javascript que carga el catalogo desde datos simulados y valida los formularios en el cliente.

INSTRUCCIONES DE EJECUCIÓN:
1.- Clonar o descargar el repositorio.
2.- Hacer doble clic en index.html(o abrirlo con el navegador: Archivo > abrir Archivo)
3.- Navega por el sitio usando el menú superior


ESTRUCTURA DE CARPETAS:

gamehub-store/
|
|____Vistas
|    ├── index.html          # Vista 1: Inicio
|    ├── catalogo.html        # Vista 2: Catálogo por categoría
|    ├── detalle.html          # Vista 3: Detalle de producto
|    ├── carrito.html           # Vista 4: Carrito de compras
|    ├── checkout.html           # Vista 5: Checkout
|    ├── ordenes.html              # Vista 6: Mis órdenes
|
├── css/
│   └── styles.css        # Hoja de estilos externa única (Paleta 4)
├── js/
│   ├── data.js            # Categorías y productos simulados
│   ├── carrito-storage.js  # Lógica compartida de lectura/escritura del carrito
│   ├── inicio.js            # Lógica exclusiva de index.html
│   ├── catalogo.js           # Lógica exclusiva de catalogo.html
│   ├── detalle.js              # Lógica exclusiva de detalle.html
│   ├── carrito.js                # Lógica exclusiva de carrito.html
│   ├── checkout.js                # Lógica exclusiva de checkout.html
│   ├── ordenes.js                   # Lógica exclusiva de ordenes.html
│   └── validaciones.js               # Validación de formularios, compartida
├── img/
│   ├── productos/          # Imágenes de cada producto
│   └── ...                  # Poster y video del producto destacado
└── README.md
