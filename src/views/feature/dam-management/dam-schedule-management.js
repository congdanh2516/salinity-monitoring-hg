import React, { useEffect, useState, useRef } from "react"
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CButton,
    CFormInput,
    CForm,
    CToaster,
    CSpinner,
    CFormTextarea
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilTrash,
    cilMagnifyingGlass,
    cilReload,
    cilPlus
  } from '@coreui/icons'
import CustomPagination from "src/views/customs/my-pagination"
import CustomModal from "src/views/customs/my-modal"
import createToast from "src/views/customs/my-toast"
import { createFailIcon, createSuccessIcon } from "src/views/customs/my-icon"
import { createDamSchedule, createDamType, defaultDamStatusId, deleteDamSchedule, deleteDamType, getAllDamSchedules, getAllDamTypes, getDamScheduleId, getDamTypeById, updateDamSchedule, updateDamType } from "src/services/dam-services"
import CustomSpinner from "src/views/customs/my-spinner"
import CustomDateTimePickerV2 from "src/views/customs/my-datetimepicker/my-datetimepicker-time"
import { formatDate } from "src/tools"

const DamScheduleManagement = ({damInstance, rebaseDetailPage}) => {
    

    // Dam Schedule Management
    const [listDamSchedules, setListDamSchedules] = useState([])
    const [isLoadedDamSchedules, setIsLoadedDamSchedules] = useState(false)
    const handleSetIsLoadedDamSchedules = (value) => {
        setIsLoadedDamSchedules(prev => {
            return { ...prev, isLoadedDamSchedules: value }
        })
    }
    useEffect(() => {
        handleSetIsLoadedDamSchedules(true)
    }, [listDamSchedules])
    
    // Call inital APIs
    const rebaseAllData = () => {
        if (damInstance) {
            getAllDamSchedules(damInstance?.damId)
            .then(res => {
                // Install filter users here
                const damSchedules = res?.data
                setListDamSchedules(damSchedules)
                setFilteredDamSchedules(damSchedules)
            })
            .catch(err => {
                // Do nothing
            })
        }
    }
    useEffect(() => {
       rebaseAllData()
    },[])

    // Searching data
    const [filteredDamSchedules, setFilteredDamSchedules] = useState([])
    const initSearch = {
        damScheduleDay: "",
        damScheduleMonth: "",
        damScheduleYear: ""
    }
    const [searchState, setSearchState] = useState(initSearch)
    const {damScheduleDay,damScheduleMonth, damScheduleYear} = searchState
    const handleSetDamScheduleDay = (value) => {
        setSearchState(prev => {
            return {...prev, damScheduleDay: value}
        })
    }
    const handleSetDamScheduleMonth = (value) => {
        setSearchState(prev => {
            return {...prev, damScheduleMonth: value}
        })
    }
    const handleSetDamScheduleYear = (value) => {
        setSearchState(prev => {
            return {...prev, damScheduleYear: value}
        })
    }
    const onFilter = () => {
        if (damScheduleDay || damScheduleMonth || damScheduleYear) {
            setFilteredDamSchedules(listDamSchedules)
            if (damScheduleYear) {
                setFilteredDamSchedules(prev => {
                    return prev.filter(damSchedule => damSchedule?.damScheduleBeginAt[0] === parseFloat(damScheduleYear) || damSchedule?.damScheduleEndAt[0] === parseFloat(damScheduleYear))
                })
            }
            if (damScheduleMonth) {
                setFilteredDamSchedules(prev => {
                    return prev.filter(damSchedule => damSchedule?.damScheduleBeginAt[1] === parseFloat(damScheduleMonth) || damSchedule?.damScheduleEndAt[1] === parseFloat(damScheduleMonth))
                })
            }
            if (damScheduleDay) {
                setFilteredDamSchedules(prev => {
                    return prev.filter(damSchedule => damSchedule?.damScheduleBeginAt[2] === parseFloat(damScheduleDay) || damSchedule?.damScheduleEndAt[2] === parseFloat(damScheduleDay))
                })
            }
        }else {
            onReset()
        }
    }
    const onReset = () => {
        setFilteredDamSchedules(listDamSchedules)
    }
    // Toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()


    // Pagination + Filtering
    const showFilteredTable = (filteredDamSchedules, duration, isLoaded) => {
        return (
            <>
                {
                    !isLoaded ? <CustomSpinner /> :
                    <CTable bordered align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '5%'}}>#</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '30%'}}>Diễn giải</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Ngày mở</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '20%'}}>Ngày đóng</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary" style={{'width' : '25%'}}>Thao tác</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        filteredDamSchedules?.length !== 0 ? filteredDamSchedules.map((damSchedule, index) => {
                            return (
                                <CTableRow key={damSchedule?.damScheduleId}>
                                    <CTableDataCell>{index + 1 + duration}</CTableDataCell>
                                    <CTableDataCell>{damSchedule?.damScheduleDescription}</CTableDataCell>
                                    <CTableDataCell>{`${damSchedule?.damScheduleBeginAt[0]}-${damSchedule?.damScheduleBeginAt[1]}-${damSchedule?.damScheduleBeginAt[2]} lúc ${damSchedule?.damScheduleBeginAt[3]}:${damSchedule?.damScheduleBeginAt[4]}:${damSchedule?.damScheduleBeginAt[5] ? damSchedule?.damScheduleBeginAt[5] : '00'}`}</CTableDataCell>
                                    <CTableDataCell>{`${damSchedule?.damScheduleEndAt[0]}-${damSchedule?.damScheduleEndAt[1]}-${damSchedule?.damScheduleEndAt[2]} lúc ${damSchedule?.damScheduleEndAt[3]}:${damSchedule?.damScheduleEndAt[4]}:${damSchedule?.damScheduleEndAt[5] ? damSchedule?.damScheduleEndAt[5] : '00'}`}</CTableDataCell>
                                    <CTableDataCell>
                                        <CIcon icon={cilPencil} 
                                            onClick={() => openUpdateModal(damSchedule?.damScheduleId)} 
                                            className="text-success mx-1" role="button"
                                        />
                                        <CIcon icon={cilTrash} 
                                            onClick={() => openDeleteModal(damSchedule?.damScheduleId)}  
                                            className="text-danger" role="button"
                                        />
                                    </CTableDataCell>
                                </CTableRow>    
                            )
                        }) : <CTableRow>
                            <CTableDataCell colSpan={5}><p className="text-center">{'Không có dữ liệu'}</p></CTableDataCell>
                        </CTableRow>
                    }
                </CTableBody>
              </CTable>
                }
            </>
            
        )
    }
    // Adding Modal
    const addData = {
        addDamScheduleBeginAt: "",
        addDamScheduleEndAt: "",
        addDamScheduleDescription: "",
        addDamScheduleDamId: damInstance?.damId,
        addDamScheduleDamStatusId: defaultDamStatusId
    }
    const [addState, setAddState] = useState(addData)
    const {
        addDamScheduleBeginAt,
        addDamScheduleEndAt,
        addDamScheduleDescription,
        addDamScheduleDamId,
        addDamScheduleDamStatusId
    } = addState
    const [addValidated, setAddValidated] = useState(false)
    const handleSetAddDamScheduleBeginAt = (value) => {
        setAddState(prev => {
            return { ...prev, addDamScheduleBeginAt: value }
        })
    }
    const handleSetAddDamScheduleDescription = (value) => {
        setAddState(prev => {
            return { ...prev, addDamScheduleDescription: value }
        })
    }
    const handleSetAddDamScheduleEndAt = (value) => {
        setAddState(prev => {
            return { ...prev, addDamScheduleEndAt: value }
        })
    }

    const createNewDamSchedule = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const damSchedule = {
                damScheduleBeginAt: addDamScheduleBeginAt,
                damScheduleEndAt: addDamScheduleEndAt,
                damScheduleDescription: addDamScheduleDescription?.trim(),
                damScheduleDamId: addDamScheduleDamId,
                damScheduleDamStatusId: addDamScheduleDamStatusId 
            }
            createDamSchedule(damSchedule)
            .then(res => {
                setAddVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Thêm lịch mở đập',
                    content: 'Thêm lịch mở đập thành công',
                    icon: createSuccessIcon()
                }))
                rebaseDetailPage()
                setAddValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Thêm lịch mở đập',
                    content: err?.response?.data?.message ? err?.response?.data?.message : "Thêm lịch mở đập không thành công",
                    icon: createFailIcon()
                }))
            })
        }
        setAddValidated(true)
    }

    const [addVisible, setAddVisible] = useState(false)
    const addForm = () => {
        return <>
                <CForm 
                    onSubmit={e => createNewDamSchedule(e)} 
                    noValidate
                    validated={addValidated}
                >
                    <CRow>
                        <CCol lg={12}>
                            <CustomDateTimePickerV2 
                                value={addDamScheduleBeginAt}
                                setValue={handleSetAddDamScheduleBeginAt}
                                placeholder={'Ngày mở'}
                            /> 
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CustomDateTimePickerV2 
                                value={addDamScheduleEndAt}
                                setValue={handleSetAddDamScheduleEndAt}
                                placeholder={'Ngày đóng'}
                                classes={'mt-4'}
                            /> 
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12}>
                            <CFormTextarea
                                className="mt-4"
                                type="text"
                                placeholder="Mô tả lịch mở đập"
                                maxLength={250}
                                feedbackInvalid="Không bỏ trống và ít hơn 250 ký tự"
                                onChange={(e) => handleSetAddDamScheduleDescription(e.target.value)}
                                value={addDamScheduleDescription}
                                rows={3}
                                aria-describedby="exampleFormControlInputHelpInline"
                            ></CFormTextarea>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol lg={12} className="d-flex justify-content-end">
                            <CButton type="submit" className="mt-4" color="primary">Hoàn tất</CButton>
                        </CCol>
                    </CRow>
                </CForm> 
        </>


    }
 
    // Updating Model
    const updateData = {
        updateDamScheduleId: "",
        updateDamScheduleBeginAt: "",
        updateDamScheduleEndAt: "",
        updateDamScheduleDescription: "",
        updateDamScheduleDamId: damInstance?.damId,
        updateDamScheduleDamStatusId: defaultDamStatusId
    }
    const [updateState, setUpdateState] = useState(updateData)
    const { 
        updateDamScheduleId,
        updateDamScheduleBeginAt,
        updateDamScheduleEndAt,
        updateDamScheduleDescription,
        updateDamScheduleDamId,
        updateDamScheduleDamStatusId
    } = updateState
    const [updateValidated, setUpdateValidated] = useState(false)
    const getDamScheduleDataById = (damScheduleId) => {
        if (damScheduleId) {
            getDamScheduleId(damScheduleId)
            .then(res => {
                const damSchedule = res?.data
                if (damSchedule) {
                    const updateDamScheduleFetchData = {
                        updateDamScheduleId: damSchedule?.damScheduleId,
                        updateDamScheduleBeginAt: formatDate(damSchedule?.damScheduleBeginAt),
                        updateDamScheduleEndAt: formatDate(damSchedule?.damScheduleEndAt),
                        updateDamScheduleDescription: damSchedule?.damScheduleDescription,
                        updateDamScheduleDamId: damInstance?.damId,
                        updateDamScheduleDamStatusId: defaultDamStatusId
                    }
                    setUpdateState(updateDamScheduleFetchData)
                    rebaseDetailPage()
                }else {
                    addToast(createToast({
                        title: 'Cập nhật lịch mở đập',
                        content: "Thông tin lịch mở đập không đúng",
                        icon: createFailIcon()
                    }))
                }
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật lịch mở đập',
                    content: "Thông tin lịch mở đập không đúng",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const openUpdateModal = (damScheduleId) => {
        getDamScheduleDataById(damScheduleId)
        setUpdateVisible(true)
    }
    const handleSetUpdateDamScheduleBeginAt = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamScheduleBeginAt: value }
        })
    }
    const handleSetUpdateDamScheduleDescription = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamScheduleDescription: value }
        })
    }
    const handleSetUpdateDamScheduleEndAt = (value) => {
        setUpdateState(prev => {
            return { ...prev, updateDamScheduleEndAt: value }
        })
    }
    const updateADamSchedule = (e) => {
        // validation
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            const damSchedule = {
                damScheduleId: updateDamScheduleId,
                damScheduleBeginAt: updateDamScheduleBeginAt,
                damScheduleEndAt: updateDamScheduleEndAt,
                damScheduleDescription: updateDamScheduleDescription,
                damScheduleDamId: updateDamScheduleDamId,
                damScheduleDamStatusId: updateDamScheduleDamStatusId
            }
            updateDamSchedule(damSchedule)
            .then(res => {
                setUpdateVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Cập nhật lịch mở đập',
                    content: 'Cập nhật lịch mở đập thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Cập nhật lịch mở đập',
                    content: err?.response?.data?.message ? err?.response?.data?.message : "Cập nhật lịch mở đập không thành công",
                    icon: createFailIcon()
                }))
            })  
        }
        setUpdateValidated(true)
    }
    const [updateVisible, setUpdateVisible] = useState(false)
    const updateForm = (isLoaded) => { 
        return (
            <>
                {  isLoaded ? 
                    <CForm 
                        onSubmit={e => updateADamSchedule(e)} 
                        noValidate
                        validated={updateValidated}
                    >
                        <CRow>
                            <CCol lg={12}>
                                <CustomDateTimePickerV2 
                                    value={updateDamScheduleBeginAt}
                                    setValue={handleSetUpdateDamScheduleBeginAt}
                                    placeholder={'Ngày mở'}
                                /> 
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CustomDateTimePickerV2 
                                    value={updateDamScheduleEndAt}
                                    setValue={handleSetUpdateDamScheduleEndAt}
                                    placeholder={'Ngày đóng'}
                                    classes={'mt-4'}
                                /> 
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12}>
                                <CFormTextarea
                                    className="mt-4"
                                    type="text"
                                    placeholder="Mô tả lịch mở đập"
                                    maxLength={250}
                                    feedbackInvalid="Không bỏ trống và ít hơn 250 ký tự"
                                    onChange={(e) => handleSetUpdateDamScheduleDescription(e.target.value)}
                                    value={updateDamScheduleDescription}
                                    rows={3}
                                    aria-describedby="exampleFormControlInputHelpInline"
                                ></CFormTextarea>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol lg={12} className="d-flex justify-content-end">
                                <CButton type="submit" className="mt-4" color="primary">Hoàn tất</CButton>
                            </CCol>
                        </CRow>
                    </CForm> : <CSpinner />
                }
            </>
        )
    }

    // Delete
    const deleteADamSchedule = (damScheduleId) => {
        if (damScheduleId) {
            deleteDamSchedule(damScheduleId)
            .then(res => {
                setDeleteVisible(false)
                rebaseAllData()
                addToast(createToast({
                    title: 'Xóa lịch mở đập',
                    content: 'Xóa lịch mở đập thành công',
                    icon: createSuccessIcon()
                }))
                setUpdateValidated(false)
                rebaseDetailPage()
            })
            .catch(err => {
                addToast(createToast({
                    title: 'Xóa lịch mở đập',
                    content: "Xóa lịch mở đập không thành công",
                    icon: createFailIcon()
                }))
            })
        }
    }
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteDamScheduleId, setDeleteDamScheduleId] = useState(0)
    const deleteForm = (damScheduleId) => {
        return (
            <>
                {   
                    damScheduleId ? 
                    <CForm onSubmit={() => deleteADamSchedule(damScheduleId)}>
                        <CRow>
                            <CCol md={12}>
                                <p>Bạn có chắc muốn xóa lịch mở đập này ?</p>
                            </CCol>
                            <CCol md={12} className="d-flex justify-content-end">
                                <CButton color="primary" type="submit">Xác nhận</CButton>
                                <CButton color="danger" onClick={() => setDeleteVisible(false)} className="text-white ms-3">Hủy</CButton>
                            </CCol>
                        </CRow>
                    </CForm> : <CSpinner />
                }
            </>
        )
    }
    const openDeleteModal = (damScheduleId) => {
        setDeleteDamScheduleId(damScheduleId)
        setDeleteVisible(true)
    }

    useEffect(() => {
        // To reset all add state
        setAddState(addData)
        setUpdateState(updateData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addVisible, updateVisible])

    return (
        <CCard className="mb-4">
        <CToaster ref={toaster} push={toast} placement="top-end" />
        <CCardBody>
            <CustomModal visible={addVisible} title={'Thêm lịch mở đập'} body={addForm()} setVisible={(value) => setAddVisible(value)}/>
            <CustomModal visible={updateVisible} title={'Cập nhật lịch mở đập'} body={updateForm(updateDamScheduleBeginAt)} setVisible={(value) => setUpdateVisible(value)}/>
            <CustomModal visible={deleteVisible} title={'Xóa người lịch mở đập'} body={deleteForm(deleteDamScheduleId)} setVisible={(value) => setDeleteVisible(value)}/>
            <CForm onSubmit={onFilter}>
                <CRow>
                    <CCol md={12} lg={3}>
                        <CFormInput
                            className="mb-2"
                            type="text"
                            placeholder="Ngày"
                            onChange={(e) => handleSetDamScheduleDay(e.target.value)}
                            aria-describedby="exampleFormControlInputHelpInline"
                        />
                    </CCol>
                    <CCol md={12} lg={3}>
                        <CFormInput
                            className="mb-2"
                            type="text"
                            placeholder="Tháng"
                            onChange={(e) => handleSetDamScheduleMonth(e.target.value)}
                            aria-describedby="exampleFormControlInputHelpInline"
                        />
                    </CCol>
                    <CCol md={12} lg={3}>
                        <CFormInput
                            className="mb-2"
                            type="text"
                            placeholder="Năm"
                            onChange={(e) => handleSetDamScheduleYear(e.target.value)}
                            aria-describedby="exampleFormControlInputHelpInline"
                        />
                    </CCol>
                    <CCol md={12} lg={3}>
                        <CButton color="primary" className="me-2 " type="submit">
                            <CIcon icon={cilMagnifyingGlass} className="text-white"/>                             
                        </CButton>
                        <CButton color="success" onClick={onReset}>
                            <CIcon icon={cilReload} className="text-white"/>   
                        </CButton>
                    </CCol>
                </CRow>
          </CForm>
          <br />
          <CRow>
            <CCol xs={12}>
                <CButton type="button" color="primary" onClick={() => setAddVisible(true)}>Thêm <CIcon icon={cilPlus}/></CButton>
            </CCol>
          </CRow>
          <br />
          <CustomPagination listItems={filteredDamSchedules} showData={showFilteredTable} isLoaded={isLoadedDamSchedules} />
        </CCardBody>
      </CCard>
    )
}

export default DamScheduleManagement