import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  List
} from "reactstrap";

function EtiquetadoIntermedioModal(props) {

  return (
    <>
      {/* Modal para cambiar el etiquetado del registro*/}
      <Modal isOpen={props.isOpen} toggle={props.toggle}>
        {(props.is_superuser || props.is_staff) ?
          <>
            <ModalHeader tag="h3" toggle={props.toggle}>Etiquetado del Registro</ModalHeader>
            <ModalBody>
              <>
                <h3>Se abrira una nueva pestaña con Label Studio para que puedas calificar el etiquetado de la fotografia</h3>
                <h3>Una vez terminado regresa a esta pestaña y: </h3>
                <List type="unstyled">
                  <ul>
                    <li>Si el etiquetado es correcto presiona el boton 'Finalizar'</li>
                    <li>Si el etiquetado es incorrecto presiona el boton 'Rechazar' con sus debidas Observaciones</li>
                  </ul>
                </List>
              </>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={props.onConfirm}>Ir a Label-Studio</Button>{' '}
              <Button color="secondary" onClick={props.toggle}>Cancelar</Button>
            </ModalFooter>
          </>
          :
          <>
            {props.rechazado ?
              <>
                <ModalHeader tag="h3" toggle={props.toggle}>Etiquetado del Registro</ModalHeader>
                <ModalBody>
                  <>
                    <h3>Se abrira una nueva pestaña con Label Studio para que puedas etiquetar la fotografia</h3>
                    <h3>Una vez terminado regresa a esta pestaña y dale clic en el boton Listo</h3>
                    <List type="unstyled">
                      <li>El etiquetado fue rechazado con las siguientes observaciones: </li>
                      <ul>
                        <li>{props.observaciones}</li>
                      </ul>
                    </List>
                  </>
                </ModalBody>
                <ModalFooter>
                  <Button color="success" onClick={props.onConfirm}>Ir a Label-Studio</Button>{' '}
                  <Button color="secondary" onClick={props.toggle}>Cancelar</Button>
                </ModalFooter>
              </>
              :
              <>
                <ModalHeader tag="h3" toggle={props.toggle}>Etiquetado del Registro</ModalHeader>
                <ModalBody>
                  <>
                    <h3>Se abrira una nueva pestaña con Label Studio para que puedas etiquetar la fotografia</h3>
                    <h3>Una vez terminado regresa a esta pestaña y dale clic en el boton Listo</h3>
                  </>
                </ModalBody>
                <ModalFooter>
                  <Button color="success" onClick={props.onConfirm}>Ir a Label-Studio</Button>{' '}
                  <Button color="secondary" onClick={props.toggle}>Cancelar</Button>
                </ModalFooter>
              </>
            }
          </>
        }
      </Modal>
    </>
  )
}

export default EtiquetadoIntermedioModal;