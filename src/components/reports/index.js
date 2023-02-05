import { Row, Col, Card, Table } from "antd";
import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import axios from "axios";
import moment from "moment";

const url = 'https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-xaomc/endpoint'

function Reports() {
    const [loading, setloading] = useState(false)
    const [list, setlist] = useState(null)

    async function getReports() {
        setloading(true)
        await axios.post(`${url}/get`, {
            "db": "flood_monitoring",
            "col": "reports",
            "query": {}
        }).then(res => {
            console.log(res.data)
            setlist(res.data)
            setloading(false)
        }).catch(err => {
            console.log(err.message)
            setloading(false)
        })
    }

    useEffect(()=>{
        getReports()
    }, [])
    const column = [
        {
            width: "15%",
            title: "DATE APPEARED",
            sorter: {
                compare: (a, b) => moment(`${b.datetime}}`) - moment(`${a.datetime}`),
            },
            render: val => (
                <Col style={{ fontSize: 13 }}>
                    {moment(`${val.datetime}`).format("MMMM DD, YYYY @ hh:MM A")}
                </Col>
            ),
            key: "datetime"
        },
        {
            width: "20%",
            title: "Area Affected",
            render: val => (
                <center>{val.area_affected}</center>
            )
        },
        {
            width: "20%",
            title: "Water Level",
            render: val => (
                <center>{val.water_level}</center>
            )
        },
        {
            width: "20%",
            title: "Severity",
            render: val => (
                <center>{val.severity.toUpperCase()}</center>
            )
        },
        {
            width: "30%",
            title: "Recommendation",
            render: val => (
                <center>{val.recommendation}</center>
            )
        }
    ]

    return <Row gutter={[24, 0]} style={{ margin: 10 }}>
        <Col xs={24}>
            <div style={{ float: "right", padding: 10 }}>
                <NavLink
                    to="/"
                >
                    Back to Dashboard
                </NavLink>
            </div>
        </Col>
        <Col xs={24}>
            <Card
                title={"Reports"}
                bordered
            >
                <Table
                    size="small"
                    filterDropdown
                    className="ant-list-box table-responsive bg-white"
                    sorter
                    loading={loading}
                    columns={column}
                    dataSource={list}
                    scroll={null}
                    pagination={{ pageSize: 100, position: ["bottomLeft"] }}
                />
            </Card>
        </Col>
    </Row>
}

export default Reports