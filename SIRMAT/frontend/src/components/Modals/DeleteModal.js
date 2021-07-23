import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  Row
} from "reactstrap";

function DeleteModal(props) {
  return (
    <>
      {/* Modal para agregar nuevo registro */}
      <Modal isOpen={props.isOpen} toggle={props.toggle}>
        <ModalHeader tag="h3" toggle={props.toggle}>Eliminar Registro</ModalHeader>
        <ModalBody>
          <h3>¿Estas seguro que quieres dar de baja este registro?</h3>
          <h3>Esta accion es irreversible</h3>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={props.onConfirm}>Dar de baja</Button>{' '}
          <Button color="secondary" onClick={props.toggle}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default DeleteModal;