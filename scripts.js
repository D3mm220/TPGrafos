let nodes = [];
let selectedNode = null;
let arcos = [];
let extremos = [];
let grados = [];
//let sendero = [];

function agregar(node) {
  if (node !== extremos[0] && node !== extremos[1]) {
    extremos.push(node);
  }

  if (extremos.length > 2) {
    extremos.shift();
  }  

  return extremos;
}

function comparar(nodo1, nodo2) {
  if (nodo1['x'] === nodo2['node1']['x'] && nodo1['y'] === nodo2['node1']['y']) {
    return nodo2['node2'];
  } else if (nodo1['x'] === nodo2['node2']['x'] && nodo1['y'] === nodo2['node2']['y']) {
    return nodo2['node1'];
  } else {
    return false;
}
}

function repetida(nodo, lista) {
  const res = lista.some(vertice => {
    return vertice.x === nodo.x && vertice.y === nodo.y;
  });

  return res;
}

function actualizar() {
  for (let index1 = 0; index1 < grados.length; index1++) {
    let grado = grados[index1]['nodo'];

    const conexiones_nodo = Object.values(grados[index1]['conexiones'])
   
    for (let index2 = 0; index2 < arcos.length; index2++) {
     
      const nodo_conectado = comparar(grado, arcos[index2])

      if (nodo_conectado !== false && !repetida(nodo_conectado, conexiones_nodo)){
        grados[index1]['conexiones'].push(nodo_conectado);
      }
     
    }
  }
};

function getNodeAt(x, y, nodes) {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    const a = x - node.x;
    const b = y - node.y;
    const c = Math.sqrt(a * a + b * b);

    if (c < 45) {
      return node;
    }
  }
  return null;
}

function drawNodes(ctx, nodes) {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    if (node === selectedNode) {
      ctx.strokeStyle = "#FF0000";
    } else if (node === extremos[0] || node === extremos[1]) {
      ctx.strokeStyle = "#5DE619";
    } else {
      ctx.strokeStyle = "#000000";
    }

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    if (node === selectedNode) {
      ctx.fillStyle = "#FF0000";
    } else if (node === extremos[0] || node === extremos[1]) {
      ctx.fillStyle = "#5DE619";
    } else {
      ctx.fillStyle = "#000000";
    }

    ctx.font = "15px Arial";
    ctx.fillText(index, node.x - 5, node.y + 5);
  }
}

function drawArcos(ctx, arcos) {
  for (let index = 0; index < arcos.length; index++) {
    const arco = arcos[index];
    ctx.moveTo(arco.node1.x, arco.node1.y);
    ctx.lineTo(arco.node2.x, arco.node2.y);
    ctx.strokeStyle = "#000000";
    ctx.stroke();
  }
}

// ############################ Graficar el camino #####################################

function comparar_nodos(nodo1, nodo2) {
  if (nodo1['x'] === nodo2['x'] && nodo1['y'] === nodo2['y']) {
    return true;
  } else {
    return false;
  }
}


function completar(lis1, lis2) {
  for (let index = 0; index < lis1.length; index++) {
    
    //const conexiones_nodo = Object.values(grados[index1]['conexiones'])
    lis2[index] = grados[index]['conexiones']

  }
}

function transformar_nodos_a_numeros(metro) {
  for (let index1 = 0; index1 < grados.length; index1++) {   
    for (let index2 = 0; index2 < metro[index1].length; index2++) {   
      for (let index3 = 0; index3 < nodes.length; index3++) {
        if (comparar_nodos(metro[index1][index2], nodes[index3]) ) {
          metro[index1].splice(index2, 1, index3);
        }
      }
    }
  }
}

function transformar_extremos_a_numeros(metro) {
  for (let index1 = 0; index1 < 2; index1++) {
    for (let index2 = 0; index2 < nodes.length; index2++) {
      if (comparar_nodos(extremos[index1], nodes[index2]) ) {
        metro.push(index2);
      }
    }
  }
}

function dijkstraNoPonderado(grafo, inicio, destino) {
  const cola = [{ nodo: inicio, camino: [inicio] }];
  const visitados = new Set();

  while (cola.length > 0) {
    const { nodo, camino } = cola.shift();

    if (nodo === destino) {
      return camino; // Hemos encontrado el camino más corto
    }

    if (!visitados.has(nodo)) {
      visitados.add(nodo);

      for (const vecino of grafo[nodo]) {
        if (!visitados.has(vecino)) {
          const nuevoCamino = [...camino, vecino];
          cola.push({ nodo: vecino, camino: nuevoCamino });
        }
      }
    }
  }

  return false; // No hay camino entre el inicio y el destino
}
/*
function armar_camino(numeros) {

  for (let index1 = 0; index1 < (numeros.length - 1); index1++) {
    const parte1 = nodes[numeros[index1]];
    const parte2 = nodes[numeros[(index1 + 1)]];

    for (let index2 = 0; index2 < arcos.length; index2++) {
      
      const conecion_nodo_1 = comparar(parte1, arcos[index2]);
      const conecion_nodo_2 = comparar(parte2, arcos[index2]);
      
      console.log(conecion_nodo_1, conecion_nodo_2);
      
      if (conecion_nodo_1 !== false && conecion_nodo_2 !== false) {
        sendero.push(arcos[index2]);
      }
    }
  }
}*/

function Hacer_camino() {
  actualizar();
  
  const listado_legible = {};
  const inicio_fin = [];

  completar(nodes, listado_legible);
  
  transformar_nodos_a_numeros(listado_legible);
  transformar_extremos_a_numeros(inicio_fin);

  console.log(listado_legible);
  console.log(inicio_fin);

  const caminoMasCorto = dijkstraNoPonderado(listado_legible, inicio_fin[0], inicio_fin[1]);
/*
  if (caminoMasCorto !== false) {
    armar_camino(caminoMasCorto);
  }*/

  if (caminoMasCorto) {
    console.log('Camino más corto:', caminoMasCorto.join(' -> '));
    console.log(caminoMasCorto);
    document.querySelector('#header').innerHTML = ('Resultado: '+ caminoMasCorto.join(' -> '));
  } else {
    console.log('No hay camino entre '+  inicio_fin[0]+ ' y '+ inicio_fin[1]);
    document.querySelector('#header').innerHTML = ('No hay camino entre '+ inicio_fin[0]+ ' y '+ inicio_fin[1]);
  }
}

//##########################################################

window.onload = async () => {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  canvas.addEventListener("dblclick", (e) => {
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;


    let selectedN = getNodeAt(x, y, nodes);


    console.log(selectedN);


    agregar(selectedN);
   
    context.clearRect(0, 0, canvas.width, canvas.height);


    drawArcos(context, arcos);
    drawNodes(context, nodes);


  });

  canvas.addEventListener("click", (e) => {
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;

    let tempNode = getNodeAt(x, y, nodes);

    if (selectedNode !== null && tempNode === null) {
      selectedNode = tempNode;
      tempNode = null;
    }

    if (selectedNode === null) {
      selectedNode = tempNode;
      tempNode = null;
    }

    if (selectedNode === null) {
      nodes.push({ x, y });
      grados.push({nodo: { x, y }, conexiones: []});
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedNode !== null && tempNode !== null) {
     
      const existe = arcos.some((arco) => {
        return (
          (arco.node1 === selectedNode && arco.node2 === tempNode) ||
          (arco.node1 === tempNode && arco.node2 === selectedNode)
        );
      });
 
      if (!existe && selectedNode !== tempNode) {
        arcos.push({ node1: selectedNode, node2: tempNode }); 
      }
     
      selectedNode = null;
      tempNode = null;
    }

    drawArcos(context, arcos);
    drawNodes(context, nodes);
  });

};