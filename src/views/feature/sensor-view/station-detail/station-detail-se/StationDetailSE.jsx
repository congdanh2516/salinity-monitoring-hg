import React, { useEffect, useRef } from "react"
import './StationDetailSE.scss'

import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";

//modal 
import { CModal, CNav, CNavItem, CNavLink, CTabContent, CButton } from '@coreui/react';

//chart
import { CCard, CCardBody, CCol, CCardHeader, CRow, CTabPane } from '@coreui/react'

//chart
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { useState } from 'react';

//higth chart 
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

//service
import thingService from 'src/services/thing';
import observation from "src/services/observation";

import { useParams } from "react-router-dom";
import station from "src/services/station";

function zones(colors) {
  return [{
    value: 1707294600000,
    dashStyle: 'dot',
    color: colors[0],
    // fillColor: '#7cb5ec'
  }, {
    value: 1706776200000,
    dashStyle: 'solid',
    color: colors[1]
  }]
}

const colors = [
  ['#7cb5ec', '#FFA262', '#7cb5ec'],
  ['#7cb5ec', '#8bbc21', '#7cb5ec']
]
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
const StationDetailSE = () => {
    const { type, id } = useParams();

    const [showMode, setShowMode] = useState('chart'); //table

    //sensor list
    const [sensorList, setSensorList] = useState([])

    const [thing, setThing] = useState();

    //tab
    const [activeKey, setActiveKey] = useState(0);
    const [selectingSensor, setSelectingSensor] = useState();  //luu tru id sensor dang duoc chon hay dang xem
    const [selectingMultiDTS, setSelectingMultiDTS] = useState(); //id multidatastream
    const [selectingMultiDTSValue, setSelectingMultiDTSValue] = useState(); //manng gia trị sensor/multidatastreamid hien tai

    const [multiDTSStation, setMultiDTSStation] = useState();

    const [latestValueSensorList, setLatestValueSensorList] = useState([]);

    //option chart <<
    const [optionsss, setOptionsss] = useState(
      {
        chart: {
          type: 'line',
          height: 550, // Set the desired height here
        },
        plotOptions: {
          series: {
              color: '#1a2848'
          }
        },
        tooltip: {
          formatter: function() {
              return 'Thời gian: <b>' + new Date(this.x).toLocaleString() + '</b>' + '<br/>Giá trị: <b>' +  this.y + '</b>';
          }
        },
      
        series: [{
          data: [],
          zoneAxis: 'x',
          marker: {
            symbol: "circle",
            radius: 3,
            enabled: true
          },
          // zones: [{value: 3}, {value: 5, color: 'red'}]
          zones: zones(colors[0])
        }]
      }
    )
    //option charr >>

    //Rynan <<
    //test <<
    const [sensorListRynan, setSensorListRynan] = useState([]);
    const [selectingSensorRynan, setSelectingSensorRynan] = useState(""); //sensor name
    const [viewMode, setViewMode] = useState("chart"); //mode name: table, chart, etc
    const [latestSensorValue, setLatestSensorValue] = useState([]); //latest value of sensors array
    const [sensorValueList, setSensorValueList] = useState([]); //all value for all sensor
    const [isLoadingSensorList, setIsLoadingSensorList] = useState(false);
    const [stationInfo, setStationInfo] = useState();
    const [dataStation, setDataStation] = useState(
      {
        chart: {
          type: 'line',
          height: 550, // Set the desired height here
        },
        plotOptions: {
          series: {
              color: '#1a2848'
          }
        },
        tooltip: {
          formatter: function() {
              return 'Thời gian: <b>' + new Date(this.x).toLocaleString() + '</b>' + '<br/>Giá trị: <b>' +  this.y + '</b>';
          }
        },
      
        series: [{
          data: [],
          zoneAxis: 'x',
          marker: {
            symbol: "circle",
            radius: 3,
            enabled: true
          },
          // zones: [{value: 3}, {value: 5, color: 'red'}]
          // zones: zones(colors[0])
        }]
      }
    )
    //test >>
    useEffect(() => {
      setIsLoadingSensorList(true);
      station.getStationListByRyan()
        .then((res) => {
          console.log("station info: ", res);
          res.data.map((station) => {
            if(id==station.so_serial) {
              setStationInfo(station);
            }
          })
          setIsLoadingSensorList(false);
        })
    }, [])

    useEffect(() => {
      //get data station <<
      setIsLoadingSensorList(true);
      observation.getDataStation("L2177R1M001F001", "2024/01/10", "20245/01/18", 1, 1000)
        .then((res) => {
          setSensorValueList(res.data);
          //station list
          var sensorList = [];
          var ltsValue = [];
          for(const sensor in res.data[0]) {
            if(sensor !== "trang_thai" && !isNaN(res.data[0][sensor]) && res.data[0][sensor] !== null) {
              sensorList.push(sensor);
              setSensorListRynan(sensorList);

              //set latest value for all sensor
              let ltsValue1Sensor = {sensorName: '', sensorValue: 0, time: ''};
              ltsValue1Sensor.sensorName = sensor;
              ltsValue1Sensor.sensorValue = res.data[res.data.length-1][sensor];
              ltsValue1Sensor.time = new Date(res.data[res.data.length-1].ngay_gui).toLocaleString();
              ltsValue.push(ltsValue1Sensor);
              setLatestSensorValue(ltsValue);
            }
          }
          //options array
          var pointArray = [];
          res?.data.map((multi) => {
            var point = {
              x: new Date(multi.ngay_gui.substring(0, multi.ngay_gui.length-5)).getTime(),
              y: Number(selectingSensorRynan == "" ? multi[sensorList[0]] : multi[selectingSensorRynan]),
              color: '#1a2848'
            }
            pointArray.push(point);
            if(selectingSensorRynan=="") {
              setSelectingSensorRynan(sensorList[0]);
            }
          })
          // setSelectingMultiDTSValue(res);
          return pointArray;
        })
        .then((res) => {
          console.log("ryan dataa: ", res);
          setDataStation(
            {
              chart: {
                type: 'line',
                height: 550, // Set the desired height here
              },
              plotOptions: {
                series: {
                    color: '#1a2848'
                }
              },
              tooltip: {
                formatter: function() {
                    return 'Thời gian: <b>' + new Date(this.x).toLocaleString() + '</b>' + '<br/>Giá trị: <b>' +  this.y + '</b>';
                }
              },
            
              series: [{
                data: res,
                zoneAxis: 'x',
                marker: {
                  symbol: "circle",
                  radius: 2,
                  enabled: true
                },
                // zones: [{value: 3}, {value: 5, color: 'red'}]
                // zones: zones(colors[0])
              }]
            }
          )
          setIsLoadingSensorList(false);
        })
      //get data station >>
     
      //Rynan >>

      //get sensor list in specific thing/station
      // thingService.getThingById(id)
      //   .then((res) => {
      //     setThing(res);
      //     console.log("thing info: ", res);
      //     setMultiDTSStation(res?.multiDataStreamDTOs);
      //     setSelectingMultiDTS(res?.multiDataStreamDTOs[1]?.multiDataStreamId)
      //     //loc danh sach station
      //     console.log("selecting sensor id: ", res?.multiDataStreamDTOs[0]?.sensor?.sensorId);
      //     setSelectingSensor(res?.multiDataStreamDTOs[0]?.sensor?.sensorId);
      //     var sensorLists = []; 
      //     res?.multiDataStreamDTOs.map((multiDTS) => {
      //       sensorLists.push(multiDTS.sensor);
      //       setSensorList(sensorLists);
      //       console.log("sensor list: ", sensorLists);
      //     })
      //     console.log("res thing info: ", res);
      //     return sensorLists;
      //   })
      //   .then((res) => {
      //     setSelectingSensor(res[0]?.sensorId);
      //   })
    }, [selectingSensorRynan])

    //SE Team

    //get all value by data stream id <<
    // useEffect(() => {
    //   console.log("selecting: ", selectingMultiDTS)
    //   observation.getAllValueByDataStreamId(selectingMultiDTS)
    //     .then((res) => {
    //       console.log("abc: ", res);
    //       var d = new Date(res[0]?.resultTime.substring(0, res[0]?.resultTime.length-5));
    //       console.log("d: ", d.getTime());
    //       var pointArray = [];
    //       res.map((multi) => {
    //         var point = {
    //           x: new Date(multi.resultTime.substring(0, multi.resultTime.length-5)).getTime(),
    //           y: Number(multi.result),
    //           color: '#1a2848'
    //         }
    //         pointArray.push(point);
    //       })
    //       console.log("selecting multidata value: ", res);
    //       setSelectingMultiDTSValue(res);
    //       return pointArray;
    //     })
    //     .then((res) => {
    //       console.log("dataa: ", res);
    //       setOptionsss(
    //         {
    //           chart: {
    //             type: 'line',
    //             height: 550, // Set the desired height here
    //           },
    //           plotOptions: {
    //             series: {
    //                 color: '#1a2848'
    //             }
    //           },
    //           tooltip: {
    //             formatter: function() {
    //                 return 'Thời gian: <b>' + new Date(this.x).toLocaleString() + '</b>' + '<br/>Giá trị: <b>' +  this.y + '</b>';
    //             }
    //           },
            
    //           series: [{
    //             data: res,
    //             zoneAxis: 'x',
    //             marker: {
    //               symbol: "circle",
    //               radius: 3,
    //               enabled: true
    //             },
    //             // zones: [{value: 3}, {value: 5, color: 'red'}]
    //             // zones: zones(colors[0])
    //           }]
    //         }
    //       )
    //       console.log("optionsss: ", optionsss);
    //     })
    // }, [selectingMultiDTS])
    //get all value by data stream id >>

    //change view: chart/table
    // const handelChangeShowMode = (modeStr) => {
    //   setShowMode(modeStr);
    //   if(modeStr==='table') {
    //     handleGetLatestValueAllSensor();
    //   }
    // } 

    //change: sensor device
    // const handleChangeSelectingSensor = (index, sensorId) => {  // change tab
    //   setActiveKey(index);
    //   setSelectingSensor(sensorId);
    //   setSelectingMultiDTS(handleFindMultiDTSIdBySensorId(sensorId));
    //   console.log("data: ", optionsss.series.data);
    // }

    // const handleFindMultiDTSIdBySensorId = (sensorId) => { //ham tim multi datastreamid dua vao sensor id
    //   for(let i=0; i<multiDTSStation?.length; i++) {
    //     if(sensorId===multiDTSStation[i].sensor.sensorId) {
    //       console.log("multiId: ", multiDTSStation[i].multiDataStreamId);
    //       return multiDTSStation[i].multiDataStreamId;
    //     }
    //   }
    // }

    // const handleGetLatestValueAllSensor = () => {
    //   var latestValueSL=[];
    //   sensorList.map((sensor) => {
    //     observation.getLatestValueByDataStreamId(sensor.sensorId)
    //       .then((res) => {
    //         // setLatestValueSensorList(...latestValueSensorList, res);
    //         latestValueSL.push(res);
    //         setLatestValueSensorList(latestValueSL);
    //       })
    //   })
    // }

    // Rynan <<
    const handleChangeSensorViewRynan = (sensorName, index) => {
      setActiveKey(index);
      setSelectingSensorRynan(sensorName);
      console.log("series data: ", dataStation.series[0].data);
    }
    const handleChangeViewModeRynan = (modeName) => {
      setViewMode(modeName);
    }
    //Rynan >>

    return (<>
        {/* <CRow className="station-detail2">
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="station-detail2__header">Danh sách trạm cảm biến/{thing?.nameThing}</CCardHeader>
            <CCardBody className="station-detail2__body">
              <CRow>
                <CCol xs={12}>
                  <CRow>
                    <CCol xs={12} className="station-detail2__body__formating">
                      <div 
                        className={showMode=='table'? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
                        onClick={() => handelChangeShowMode('table')}
                      >
                        <FontAwesomeIcon icon={faTableCells}/>
                      </div>
                      <div 
                        className={showMode=='chart'? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
                        onClick={() => handelChangeShowMode('chart')}
                      >
                        <FontAwesomeIcon icon={faChartLine}/>
                      </div>
                    </CCol>
                  </CRow>
                  {
                    showMode=='chart' && <div>
                      <CRow>
                        <CCol>
                          <CNav variant="tabs" role="tablist">
                            {
                              sensorList.map((sensor, index) => {
                                return <>
                                  <CNavItem role="presentation">
                                    <CNavLink
                                      active={activeKey === index}
                                      component="button"
                                      role="tab"
                                      aria-controls="home-tab-pane"
                                      aria-selected={activeKey === index}
                                      onClick={() => handleChangeSelectingSensor(index, sensor.sensorId)}
                                    >
                                      { sensor.sensorName }
                                    </CNavLink>
                                  </CNavItem>
                                </>
                              })
                            }
                          </CNav>
                          <CTabContent>
                            {
                              sensorList.map((sensor, index) => {
                                return <>
                                  <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      constructorType={'stockChart'}
                                      options={dataStation}
                                    />
                                  </CTabPane>
                                </>
                              })
                            }
                          </CTabContent>
                        </CCol>
                      </CRow>
                    </div>
                  }
                  {
                    showMode=='table' && <div>
                      <CRow className="station-detail2__body__table">
                        <CCol xs={6} className="station-detail2__body__table__general-index">
                          <div className="station-detail2__body__table__general-index__header">
                            Chỉ số chung
                          </div>
                          <div className="station-detail2__body__table__general-index__table">
                            <table className="station-value">
                                  <tr>
                                    <th className="time">Thời gian</th>
                                    <th className="type">Cảm biến</th>
                                    <th className="index">Giá trị</th>
                                    <th className="unit">Đơn vị</th>
                                  </tr>
                                  {
                                    sensorList.map((sensor, index) => {
                                      return <>
                                        <tr>
                                          <td className="time">08:00 27/12/2023</td>
                                          <td>{ sensor.sensorName }</td>
                                          <td className="index">{ 9.6+index }</td>
                                          <td className="unit">ppt</td>
                                        </tr>
                                      </>
                                    })
                                  }
                            </table>
                          </div>
                        </CCol>
                        <CCol xs={6}>
                          <CNav variant="tabs" role="tablist">
                            {
                              sensorList.map((sensor, index) => {
                                return <>
                                  <CNavItem role="presentation">
                                    <CNavLink
                                      active={activeKey === index}
                                      component="button"
                                      role="tab"
                                      aria-controls="home-tab-pane"
                                      aria-selected={activeKey === index}
                                      onClick={() => handleChangeSelectingSensor(index, sensor.sensorId)}
                                    >
                                      { sensor.sensorName }
                                    </CNavLink>
                                  </CNavItem>
                                </>
                              })
                            }
                          </CNav>
                          <CTabContent>
                            {
                              sensorList.map((sensor, index) => {
                                return <>
                                  <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                                    <table className="sensor-value__specific-sensor">
                                      <tr>
                                          <th className="time">Thời gian</th>
                                          <th className="index">Giá trị</th>
                                          <th></th>
                                      </tr>
                                      {
                                        selectingMultiDTSValue.map((multiData, index) => {
                                          return  <tr key={'multi'+index}>
                                                    <td>{ multiData.resultTime }</td>
                                                    <td className="index">{ multiData.result}</td>
                                                  </tr>
                                        })
                                      }
                                    </table>
                                  </CTabPane>
                                </>
                              })
                            }
                          </CTabContent>
                        </CCol>
                      </CRow>  
                    </div>
                  }
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}

    <CRow className="station-detail2">
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="station-detail2__header">Danh sách trạm cảm biến/{ stationInfo?.ten_thiet_bi }
            {
              isLoadingSensorList &&
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            }
            </CCardHeader>
            <CCardBody className="station-detail2__body">
              <CRow>
                <CCol xs={12}>
                  <CRow>
                    <CCol xs={12} className="station-detail2__body__formating">
                      <div 
                        className={viewMode=='table'? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
                        onClick={() => {handleChangeViewModeRynan('table')}}
                      >
                        <FontAwesomeIcon icon={faTableCells}/>
                      </div>
                      <div 
                        className={viewMode=='chart'? "station-detail2__body__formating__item station-detail2__body__formating__item--active" : "station-detail2__body__formating__item"} 
                        onClick={() => {handleChangeViewModeRynan('chart')}}
                      >
                        <FontAwesomeIcon icon={faChartLine}/>
                      </div>
                    </CCol>
                  </CRow>
                  {
                    viewMode=='chart' && <div>
                      <CRow>
                        <CCol>
                          <CNav variant="tabs" role="tablist">
                            {
                              sensorListRynan.map((sensor, index) => {
                                return <>
                                  <CNavItem role="presentation">
                                    <CNavLink
                                      active={activeKey === index}
                                      component="button"
                                      role="tab"
                                      aria-controls="home-tab-pane"
                                      aria-selected={activeKey === index}
                                      onClick={() => {handleChangeSensorViewRynan(sensor, index)}}
                                    >
                                      { sensor }
                                    </CNavLink>
                                  </CNavItem>
                                </>
                              })
                            }
                          </CNav>
                          <CTabContent>
                            {
                              sensorListRynan.map((sensor, index) => {
                                return <>
                                  <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                                    <HighchartsReact
                                      highcharts={Highcharts}
                                      constructorType={'stockChart'}
                                      options={dataStation}
                                    />
                                  </CTabPane>
                                </>
                              })
                            }
                          </CTabContent>
                        </CCol>
                      </CRow>
                    </div>
                  }
                  {
                    viewMode=='table' && <div>
                      <CRow className="station-detail2__body__table">
                        <CCol xs={6} className="station-detail2__body__table__general-index">
                          <div className="station-detail2__body__table__general-index__header">
                            Chỉ số chung
                          </div>
                          <div className="station-detail2__body__table__general-index__table">
                            <table className="station-value">
                                  <tr>
                                    <th className="time">Thời gian</th>
                                    <th className="type">Cảm biến</th>
                                    <th className="index">Giá trị</th>
                                    {/* <th className="unit">Đơn vị</th> */}
                                  </tr>
                                  {
                                    latestSensorValue.map((sensor, index) => {
                                      return <>
                                        <tr>
                                          <td className="time">{ sensor.time }</td>
                                          <td>{ sensor.sensorName }</td>
                                          <td className="index">{ sensor.sensorValue }</td>
                                          {/* <td className="unit">ppt</td> */}
                                        </tr>
                                      </>
                                    })
                                  }
                            </table>
                          </div>
                        </CCol>
                        <CCol xs={6}>
                          <CNav variant="tabs" role="tablist">
                            {
                              sensorListRynan.map((sensor, index) => {
                                return <>
                                  <CNavItem role="presentation">
                                    <CNavLink
                                      active={activeKey === index}
                                      component="button"
                                      role="tab"
                                      aria-controls="home-tab-pane"
                                      aria-selected={activeKey === index}
                                      onClick={() => {handleChangeSensorViewRynan(sensor, index)}}
                                    >
                                      { sensor }
                                    </CNavLink>
                                  </CNavItem>
                                </>
                              })
                            }
                          </CNav>
                          <CTabContent>
                            {
                              sensorListRynan.map((sensor, index) => {
                                return <>
                                  <CTabPane role="tabpanel" aria-labelledby="profile-tab-pane" visible={activeKey === index}>
                                    <table className="sensor-value__specific-sensor">
                                      <tr>
                                          <th className="time">Thời gian</th>
                                          <th className="index">Giá trị</th>
                                          <th></th>
                                      </tr>
                                    </table>
                                    <div className="sensor-value-div">
                                      <table className="sensor-value__specific-sensor sensor-value__specific-sensor--value">
                                        {
                                          sensorValueList.map((certainTime, index) => {
                                            return  <tr key={index}>
                                                      <td className="time">{ new Date(certainTime.ngay_gui).toLocaleString() }</td>
                                                      <td className="index">{ certainTime[selectingSensorRynan] }</td>
                                                    </tr>
                                          })
                                        }
                                      </table>
                                    </div>
                                  </CTabPane>
                                </>
                              })
                            }
                          </CTabContent>
                        </CCol>
                      </CRow>  
                    </div>
                  }
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>)
}

export default StationDetailSE;