import React, {useState, useContext} from 'react'
import Router, {useRouter} from 'next/router';
import FileUploader from 'react-firebase-file-uploader'; 
import {css} from '@emotion/core';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import {FirebaseContext} from  '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  const [error, guardarError] = useState(false);

  const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto );

  const { nombre, empresa, imagen, url, descripcion } = valores; // extraigo los "valores" de valores

  // hook de routing para redireccionar
  const router = useRouter();

  // context con las operaciones crud de firebase, funcionalidad de Firebase para crear los productos
  const {usuario, firebase} = useContext(FirebaseContext);



  async function crearProducto() {
      
// si el usuario no esta autenticado llevar al login
if(!usuario) {
  return router.push('/login');
}

// crear el objeto de nuevo producto
const producto = {
  nombre,
  empresa,
  url,
  descripcion,
  votos: 0,
  comentarios: [],
  creado: Date.now()
}

// insertarlo en la base de datos
firebase.db.collection('productos').add(producto);




  }

  return (
    <div>
      <Layout>
          <>
            <h1
              css={css`
                  text-align:center;
                  margin-top: 5rem;
              `}
            >Nuevo Producto</h1> 
            <Formulario
              onSubmit={handleSubmit}
            >
            <fieldset>
              <legend>Información General</legend> 
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input 
                  type="text"
                  id="nombre"
                  placeholder="Tu Nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  />
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}
              
              <Campo>
                <label htmlFor="empresa">Empresa</label>
                <input 
                  type="text"
                  id="empresa"
                  placeholder="Empresa o Compañía"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  />
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}

              <Campo>
                <label htmlFor="imagen">Imagen</label>
                <FileUploader 
                  accept="image/*"
                  id="imagen" 
                  name="imagen"
                  value={imagen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  randomizeFilename
                  storageRef={firebase.storage.ref("productos")}
                  onUploadStart = {handleUploadStart}
                  onUploadError = {handleUploadError}
                  onUploadSuccess = {handleUploadSuccess}
                  onProgress={handleProgress}
                  />
              </Campo>
              {errores.imagen && <Error>{errores.imagen}</Error>}

              <Campo>
                <label htmlFor="url">URL</label>
                <input 
                  type="url"
                  id="url" 
                  name="url"
                  value={url}
                  placeholder="URL de tu producto"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  />
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>
              <Campo>
                <label htmlFor="descripcion">Descripción</label>
                <textarea 
                  id="descripcion" 
                  name="descripcion"
                  value={descripcion} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  />
              </Campo>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>
              {error && <Error>{error}</Error>}
              <InputSubmit 
                type="submit"
                value="Agregar Producto"  
                />
            </Formulario>
          </>
      </Layout>
    </div>

    
  )
}


export default NuevoProducto;