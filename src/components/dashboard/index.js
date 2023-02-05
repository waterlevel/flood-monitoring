import { NavLink } from "react-router-dom";
import { Row, Col, Card, Alert } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import WaterLevelMonitoring from "../levelmonitoring";

const url = 'https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xaomc/endpoint'

function Dashboard() {
  const [infoMsg, setinfoMsg] = useState("")
  const [data, updateData] = useState([1, 2, 3]);
  const [severity, setseverity] = useState({
    msg: "",
    des: ""
  })

  const [flow, setflow] = useState(0)

  async function getWaterLevel() {
    await axios.post(`${url}/get`, {
      "db": "flood_monitoring",
      "col": "updates",
      "query": {}
    }).then(res => {
      console.log(res.data)
      setinfoMsg("")
      const resData = res.data[0]
      const level = resData.level
      const sev = resData.severity
      setflow(resData.rain_guage)
      console.log("level: ", level)
      console.log("severity: ", severity)
      setseverity(sev)
      if (sev === "Minor") {
        setinfoMsg({
          msg: "⚠️ Detected Minor Flooding",
          desc: "Posible threat for public, please warn prepare for evacuation!"
        })
      } else if (sev === "Moderate") {
        setinfoMsg({
          msg: "⚠️ Detected Moderate Flooding",
          desc: "Consider as a public threat.\nPlease inform localities to evacuate as soon as posible.\nSome locations require evacuation of people and/or transfer of property to higher elevations."
        })
      } else if (sev === "Major") {
        setinfoMsg({
          msg: "⚠️ Detected Major Flooding",
          desc: "Consider as a public threat!\nPrepare for rescue support for emergency crisis!"
        })
      } else {
        setinfoMsg({
          msg: "No Flood Detected",
          desc: ""
        })
      }
      //const val = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
      let array = [...data, level];
      array.shift();
      console.log(array)
      updateData(array);
    }).catch(err => {
      console.log(err.message)
      setinfoMsg("Error occured while geeting real time updates!")
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getWaterLevel()
    }, 3000);
    return () => clearInterval(interval);
  },
    // eslint-disable-next-line
    [data])


  return <Row gutter={[24, 0]} style={{ margin: 10 }}>
    <Col xs={24}>
      <div style={{ float: "right", padding: 10 }}>
        <NavLink
          to="Reports"
        >
          Got to Reports
        </NavLink>
      </div>
    </Col>
    <Col xs={24} style={{ marginBottom: 20 }}>
      <b>
        SOLAR POWERED FLOOD DETECTION SYSTEM with ALARM and SMS NOTIFICATION, with RAIN GUAGE
      </b>
    </Col>
    <Col xs={8}>
      <Card
        title="🌧️ Rain Guage"
      >
        <Col xs={24}>
          <center>
            <b style={{ paddingTop: "30%" }}>
              {flow.toFixed(2)} Liter / minute
            </b>
          </center>
        </Col>
      </Card>
    </Col>
    <Col xs={16}>
      <Card
        title="🎚️ Water Level Monitoring "
      >
        <Row gutter={[24, 5]}>
          <Col xs={17}>
            <WaterLevelMonitoring data={data} />
            <center>
              <Alert
                message={<b style={{ whiteSpace: "pre" }}>{infoMsg.msg}</b>}
                description={<i style={{ whiteSpace: "pre" }}>{infoMsg.desc}</i>}
                type={severity === "Minor" ? "info" : severity === "Moderate" ? "warning" : severity === "Major" ? "error" : "success"} />
            </center>
          </Col>
          <Col xs={7}>
            Severity<br />
            {"🔴 "} - Major Flooding<br />
            {"🟡 "} - Moderate Flooding<br />
            {"🔵 "} - Minor Flooding
          </Col>
        </Row>
      </Card>
    </Col>
    <Col xs={24}>

    </Col>
  </Row>
}

export default Dashboard