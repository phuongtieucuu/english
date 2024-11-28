const express = require("express")
const secction = require("./model/secction")
const vocabulary = require("./model/vocabulary")
const asyncHandler = require("./helper")
const excel = require("exceljs");
const multer = require("multer");
const app = express()
const uploadMemory = multer({
    storage: multer.memoryStorage(),
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require("./dbs/init.mongooes")
const { Schema, Types } = require("mongoose");

app.get("/", asyncHandler(async (req, res) => {
    const result = await secction.find({})
    res.json({
        code: 200,
        message: "Success",
        data: result,
    })
}))

app.post("/", asyncHandler(async (req, res) => {
    const { sec_name } = req.body

    if (!sec_name) {
        res.json({
            code: 200,
            message: "Error Require Name Section",
        })
        return
    }

    const nameExitst = await secction.findOne({ sec_name })
    if (nameExitst) {
        res.json({
            code: 200,
            message: "Section Name Exits",
        })
        return
    }

    const result = await secction.create({ sec_name: sec_name })
    res.json({
        code: 200,
        message: "Success",
        result,
    })
}))

app.get("/:id", asyncHandler(async (req, res) => {
    const paramId = req.params.id
    const result = await vocabulary.find({ voc_sec: paramId })
    res.json({
        code: 200,
        message: "Success",
        data: result.map(i => ({ name: i.voc_name, mean: i.voc_mean, api: i.voc_api })),
    })
}))

app.post("/:id", asyncHandler(async (req, res) => {
    const paramId = req.params.id
    const { name, mean, api } = req.body
    const result = await vocabulary.findOneAndUpdate({ voc_name: name }, {
        voc_name: name,
        voc_mean: mean,
        voc_api: api,
        voc_sec: new Types.ObjectId(paramId),
    }, {
        upsert: true,
        new: true,
    })
    res.json({
        code: 200,
        message: "Success",
        data: result,
    })
}))

app.get("/export/run", asyncHandler(async (req, res) => {
    const result = await vocabulary.find({})
    const wb = new excel.Workbook()
    const ws = wb.addWorksheet("Vocabulary")
    ws.columns = [
        { header: "Name", key: "name", width: 20 },
        { header: "Mean", key: "mean", width: 20 },
        { header: "Api", key: "api", width: 10 },
        { header: "Result", key: "result", width: 10 },
    ];
    for (let i = 0; i < result.length; i++) {
        const data = result[i]
        ws.addRow({
            name: data.voc_name,
            mean: "",
            api: data.voc_api,
            result: { formula: `IF(B${i + 2} = "${data.voc_mean}",True,"")` }
        })
    }
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "tutorials.xlsx"
    );

    return await wb.xlsx.write(res);
}))


app.post("/import/run", uploadMemory.single("file"), asyncHandler(async (req, res) => {
    const file = req.file
    console.log({file});
    
    if (file.originalname.split(".")[file.originalname.split(".").length - 1] !== "xlsx") {
        res.json({
            code: 4001,
            message: "Format file err"
        })
        return
    }
    const wb = new excel.Workbook();
    const dataRead = await wb.xlsx.load(file.buffer)
    const ws = dataRead.getWorksheet("Vocabulary")
    let result = 0;
    // let vocaFound = await secction.findOne({ sec_name: "New Vocabulary" })
    // if (!vocaFound) {
    //     vocaFound = await secction.create({ sec_name: "New Vocabulary" })
    // }
    // console.log("vocaFound", vocaFound._id.toString())
    // const voc_sec = vocaFound._id.toString();
    ws.eachRow({ includeEmpty: true }, async function (row, rowNumber) {
        if (rowNumber > 1) {
            const [, name, mean, api] = row.values
            console.log({ name, mean, api })
            await vocabulary.findOneAndUpdate({ voc_name: name }, {
                voc_name: name,
                voc_mean: mean,
                voc_api: api,
            }, {
                upsert: true,
                new: true,
            })
            result++
        }
    });
    res.json({
        code: 200,
        message: "Success",
        result,
    })
}))

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: "Error",
        code: statusCode,
        message: err.message || "Internal Server Error",
    });
});


module.exports = app