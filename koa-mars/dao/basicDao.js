const request = require("request");

exports.getVesselStructure = async function (vesselId, authorization) {
    const options = {

        // TODO host走配置
        // url: "http://localhost:3000/demo/getCourse",
        url: "https://pre.mars-tech.com.cn/api/report/lps/getVesselInf12o?vesselId=" + vesselId,
        // url: "http://192.168.1.13:8080/api/basic/getVesselStructure?vesselId=" + vesselId,
        // url: "http://127.0.0.1:8080/api/basic/getVesselStructure",
        method: "GET",
        headers: {
            // Authorization: "b936adfe-1ca3-4281-840c-f1039312a0f6"
            Authorization: authorization
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
}