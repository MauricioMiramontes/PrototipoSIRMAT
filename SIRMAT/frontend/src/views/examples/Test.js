import React from "react";
import { useSelector } from 'react-redux'
import Header from "components/Headers/Header.js";

import {
    Button,
    Container,
} from "reactstrap";


function Test(props) {
    const mensaje = useSelector((state) => state.user.user_data)
    const trampas = useSelector((state) => state.trampas.trampas_data)
    const estereoscopios = useSelector((state) => state.estereoscopios.estereoscopios_data)
    const camaras = useSelector((state) => state.camaras.camaras_data)
    const especies = useSelector((state) => state.especies.especies_data)
    return (
        <>
            <Header></Header>
            <Container className="mt-4" fluid>
                <h3>Presiona cualquiera de los botones para que imprima en consola lo que esta en su cajita respectiva</h3>
                <Button
                    color="primary"
                    onClick={() => {
                        console.log(mensaje)
                    }}>
                    Usuarios
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        console.log(camaras)
                    }}>
                    Camaras
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        console.log(trampas)
                    }}>
                    Trampas
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        console.log(estereoscopios)
                    }}>
                    estereoscopios
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        console.log(especies)
                    }}>
                    Especies
                </Button>
            </Container>

        </>
    )
}

export default Test;