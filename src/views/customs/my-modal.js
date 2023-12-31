import React, { useState } from "react"
import {
    CButton,
    CModal,
    CModalTitle,
    CModalHeader,
    CModalBody,
    CModalFooter
} from "@coreui/react"

const CustomModal = ({title, body, visible, setVisible}) => {
    return (
        <>
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
            <CModalHeader onClose={() => setVisible(false)}>
                <CModalTitle id="LiveDemoExampleLabel">{title}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {body}
            </CModalBody>
            </CModal>
        </>
    )
}

export default CustomModal