
const basicDao = require("../dao/basicDao.js")
exports.getVesselStructure = async function (vesselId, authorization) {

    // return `恭喜，你拿到东西了 ${opt}`


    let data = await basicDao.getVesselStructure(vesselId, authorization);

    data = JSON.parse(data);
    if (data.code !== 0) {
        throw new Error(JSON.stringify(data))
    }

    var vessel = data.data.vesselTree;
    var holdList = vessel.children; // 舱口列表
    if (holdList.length === 0) {
        // 如果没有舱口，手动加一个
        const holdMap = {
            hatchName: "暂未配置"
        };

        holdList.push(holdMap);
    }

    vessel.children = holdList.reverse();
    // this.vessel = vessel;

    var topViewData = data.data.topViewData;

    topViewData.forEach(itme => {
        itme.hold = itme.hold.reverse();
    });

    return {
        vessel,
        topViewData
    }
} 