import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

function EtiquetadoListoModal(props) {

  return (
    <>
      {/* Modal para cambiar el etiquetado del registro*/}
      <Modal isOpen={props.isOpen} toggle={props.toggle}>
        <ModalHeader tag="h3" toggle={props.toggle}>Etiquetado del Registro</ModalHeader>
        <ModalBody>
          <>
            <h3>Dale clic en listo cuando hayas terminado de etiquetar</h3>
          </>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={props.onConfirm}>Listo</Button>{' '}
          <Button color="secondary" onClick={props.toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default EtiquetadoListoModal;