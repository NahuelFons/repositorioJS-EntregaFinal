// Cartilla: Se carga el archivon Json local
try {
    fetch('json/cartilla.json')
      .then(response => response.json())
      .then(data => {
        const productos = data.productos;
  
    const templateProd = document.getElementById('template-prod').content
    const contenedorProd = document.querySelector('.lista-productos tbody')
    const fragment = document.createDocumentFragment()
  
    // Agerga los productos al DOM
    Object.values(productos).forEach(producto => {
      templateProd.querySelector('.nombre-prod').textContent = producto.nombre
      templateProd.querySelector('.descripcion-prod').textContent = producto.descripcion
      templateProd.querySelector('.precio').textContent = producto.precio
  
      const clone = templateProd.cloneNode(true)
      fragment.appendChild(clone)
    })
  
    contenedorProd.appendChild(fragment)
  
    // ############################# PEDIDO #############################
    let carrito = {}
    const templateTabla = document.getElementById('agregar-producto-al-carro').content
    const tbodyCarrito = document.getElementById('carrito-body')
    const fragmentTabla = document.createDocumentFragment()
    const templateFoot = document.getElementById('tfooter').content
    const tfootCarrito = document.getElementById('footer')
  
    // ########################## LOCALSTORAGE ##########################
    const guardarCarritoEnLocalStorage = () => {
  
      // Genera un identificador para cada pedido. Solo cuando realizamos el pedido.
      const pedidoId = Date.now().toString()
      localStorage.setItem(`carrito_${pedidoId}`, JSON.stringify(carrito))
    }
  
    const cargarCarritoDesdeLocalStorage = () => {
      const carritoKeys = Object.keys(localStorage).filter(key => key.startsWith('carrito_'))
      const ultimoPedidoKey = carritoKeys[carritoKeys.length - 1]
      
      if (ultimoPedidoKey) {
        const carritoGuardado = localStorage.getItem(ultimoPedidoKey)
        carrito = JSON.parse(carritoGuardado)
        pintarTabla(carrito)
        pintarFooter()
      }
    }
  
    // ######################## TABLA DE CUENTA ########################
    // Agrega productos al pedido desde la tabla de productos
    contenedorProd.addEventListener('click', e => {
      if (e.target.classList.contains('boton')) {
        const filaProducto = e.target.closest('tr')
        setCarrito(filaProducto)
      }
      e.stopPropagation()
    })
  
    // Agrega productos al pedido
    const setCarrito = e => {
      const pivoteCarrito = {
        nombre: e.querySelector('.nombre-prod').textContent,
        precio: e.querySelector('.precio').textContent,
        cantidad: 1
      }
      if (carrito.hasOwnProperty(pivoteCarrito.nombre)) {
        carrito[pivoteCarrito.nombre].cantidad += 1
      } else {
        carrito[pivoteCarrito.nombre] = { ...pivoteCarrito }
      }
      pintarTabla(carrito);
    }
  
    // Escribe la tabla del pedido
    const pintarTabla = objetoCarrito => {
      Object.values(objetoCarrito).forEach(objeto => {
        const cloneTabla = templateTabla.cloneNode(true)
        cloneTabla.getElementById('producto').textContent = objeto.nombre
        cloneTabla.getElementById('cant').textContent = objeto.cantidad
        const precioUnitario = parseFloat(objeto.precio)
        const precioTotal = precioUnitario * objeto.cantidad
        cloneTabla.getElementById('precio-total-prod').textContent = precioTotal.toFixed(2)
        fragmentTabla.appendChild(cloneTabla)
      })
  
      tbodyCarrito.innerHTML = ''
      tbodyCarrito.appendChild(fragmentTabla)
      pintarFooter()
    }
  
    // ####################### FOOTER DEL PEDIDO #######################
    // Escribe el footer de la tabla del pedido
    const pintarFooter = () => {
      tfootCarrito.innerHTML = ''
  
      if (Object.keys(carrito).length === 0) {
        tfootCarrito.innerHTML = '<tr><td colspan="3">Aún no comenzaste tu pedido.</td></tr>'
      } else {
        const total = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + (cantidad * precio), 0)
        templateFoot.getElementById('total-a-pagar').textContent = total.toFixed(2)
        const cloneFoot = templateFoot.cloneNode(true)
        fragmentTabla.appendChild(cloneFoot)
        tfootCarrito.appendChild(fragmentTabla)
  
        // Botón Vaciar pedido
        const botonVaciar = document.getElementById('vaciar-tabla')
        botonVaciar.addEventListener('click', () => {
          carrito = {}
          pintarTabla(carrito)
          pintarFooter()
        })
  
        // Botón Realizar pedido
        const botonRealizarPedido = document.getElementById('realizar-pedido')
        botonRealizarPedido.addEventListener('click', () => {
          if (Object.keys(carrito).length > 0) {
            guardarCarritoEnLocalStorage()
          }
          const total = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + (cantidad * precio), 0)
          carrito = {}
          pintarTabla(carrito)
          const mensajePedidoRealizado = `Realizaste tu pedido, a la brevedad será enviado a su mesa junto con la cuenta. Precio Total: ${total.toFixed(2)}`;
          Swal.fire({
            title: 'Pedido Realizado',
            text: mensajePedidoRealizado,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#181818',
          })
        })
      }
    }
  
    // Evento para aumentar o disminuir cantidad del pedido
    tbodyCarrito.addEventListener('click', e => {
      if (e.target.classList.contains('button')) {
        aumentarDisminuir(e.target)
      }
    })
  
    // Agrega o quita mas cantidad al pedido
    const aumentarDisminuir = boton => {
      if (boton.textContent === '+') {
        const indicador = boton.parentElement.parentElement.firstElementChild.textContent
        Object.values(carrito).forEach(elemento => {
          if (elemento.nombre === indicador) {
            carrito[elemento.nombre].cantidad++
          }
        })
      }
  
      if (boton.textContent === '-') {
        const indicador = boton.parentElement.parentElement.firstElementChild.textContent
        Object.values(carrito).forEach(elemento => {
          if (elemento.nombre === indicador) {
            carrito[elemento.nombre].cantidad--
            if (carrito[elemento.nombre].cantidad === 0) {
              delete carrito[elemento.nombre]
            }
          }
        })
      }
  
      pintarTabla(carrito)
      pintarFooter()
    }
  
    })
    .catch(error => {
      console.error('Error en la carga del archivo Json:', error)
    })
    .finally(() => {
  
    });
  } catch (error) {
      console.error('Error durante la ejecución', error)
  }