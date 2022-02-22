import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

class Profile {
  constructor(pcs = 0, length = 0, width = 0, height = 0, weight = 0) {
    this.state = {
      pcs: pcs,
      length: length,
      width: width,
      height: height,
      weight: weight,
      chargeable: 0,
    };
  }
}

const lh = "http://localhost:5000";

const PublicCalculator = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dimensionType, setDimensionType] = useState("in");
  const [weightType, setWeightType] = useState("kgs");
  const [outputDimensionType, setOutputDimensionType] = useState("in");
  const [outputWeightType, setOutputWeightType] = useState("kgs");
  const [totalChargeable, setTotalChargeable] = useState(0);
  const [lines, setLines] = useState([new Profile()]);
  const [output, setOutput] = useState([]);
  const [wait, setWait] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  const handleLogIn = (e) => {
    e.preventDefault();
    const login = {
      email,
      password,
    };
    console.log("Welcome", login);
    axios
      .post(`${lh}/login_user`, login)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("Logged In", "true");
        console.log(res.data.id);
        localStorage.setItem("id", res.data.id.toString());
        navigate("/private");
      })
      .catch((err) => console.log(err.statusText));
  };

  const handleSubmit = () => {
    console.log(output);
    let clones = [];
    for (let line = 0; line < lines.length; line++) {
      clones.push(
        new Profile(
          lines[line].state.pcs,
          lines[line].state.length,
          lines[line].state.width,
          lines[line].state.height,
          lines[line].state.weight
        )
      );
    }
    console.log(clones);
    setOutput(
      [...clones],
      setWaiting(true, console.log(`after waiting ${output}`))
    );
  };

  const handleTotals = () => {
    let totals = null;
    let totalChargeable = null;
    for (let line in output) {
      console.log(line);
      totals += output[line].state.weight * output[line].state.pcs;
      totalChargeable += output[line].state.chargeable;
    }
    return (
      <div>
        <h3 className="font-bold text-xl">
          Total Weight: {roundUp(totals, 1)} {outputWeightType}
        </h3>
        <h3 className="font-bold text-xl">
          Total Chargeable: {totalChargeable} Kgs
        </h3>
      </div>
    );
  };

  const handleChange = (e, index, keyName) => {
    e.preventDefault();
    const clonedLines = [...lines];
    clonedLines[index].state[keyName] = e.target.value;
    setLines(clonedLines);
  };

  const addLine = (e) => {
    e.preventDefault();
    setLines([...lines, new Profile()]);
  };

  const removeLine = (e) => {
    e.preventDefault();
    const clone = [...lines];
    clone.splice(clone.length - 1, 1);
    setLines(clone);
  };

  const calculateChargeable = (index, pcs, length, width, height) => {
    let chargeable = 0;
    if (dimensionType === "in") {
      chargeable = ((length * width * height) / 366) * pcs;
      setTotalChargeable(totalChargeable + chargeable);
      output[index].state.chargeable = roundUp(chargeable, 1);
    } else if (dimensionType === "cm") {
      chargeable = ((length * width * height) / 6000) * pcs;
      setTotalChargeable(totalChargeable + chargeable);
      output[index].state.chargeable = roundUp(chargeable, 1);
    }
  };

  useEffect(() => {
    if (
      (lines[0].state.length === "0" && lines.length <= 1) ||
      (lines[0].state.width === "0" && lines.length <= 1) ||
      (lines[0].state.height === "0" && lines.length <= 1) ||
      (lines[0].state.weight === "0" && lines.length <= 1)
    ) {
      console.log("here");
      return;
    } else {
      console.log(`this${output}`);
      handleSubmit();
    }
  }, [wait]);

  const convertWeight = () => {
    if (
      (weightType === "kgs" && outputWeightType === "kgs") ||
      (weightType === "lbs" && outputWeightType === "lbs")
    ) {
      return;
    } else if (weightType === "kgs" && outputWeightType === "lbs") {
      for (let line in output) {
        console.log(`converting weight ${line}`);
        output[line].state.weight = roundUp(
          lines[line].state.weight * 2.2046,
          1
        );
      }
      console.log(`kgs to lbs`);
      return;
    } else if (weightType === "lbs" && outputWeightType === "kgs") {
      for (let line in output) {
        console.log(`converting weight ${line}`);
        output[line].state.weight = roundUp(
          lines[line].state.weight / 2.2046,
          1
        );
      }
      console.log(`lbs to kgs`);
      return;
    }
  };

  const convertDims = () => {
    if (
      (dimensionType === "cm" && outputDimensionType === "cm") ||
      (dimensionType === "in" && outputDimensionType === "in")
    ) {
      return;
    } else if (dimensionType === "in" && outputDimensionType === "cm") {
      for (let line in output) {
        console.log(`convert ${line}`);
        output[line].state.length = roundUp(lines[line].state.length * 2.54, 1);
        output[line].state.width = roundUp(lines[line].state.width * 2.54, 1);
        output[line].state.height = roundUp(lines[line].state.height * 2.54, 1);
      }
      return;
    } else if (dimensionType === "cm" && outputDimensionType === "in") {
      for (let line in output) {
        console.log(`convert ${line}`);
        output[line].state.length = roundUp(
          lines[line].state.length * 0.3937007874,
          1
        );
        output[line].state.width = roundUp(
          lines[line].state.width * 0.3937007874,
          1
        );
        output[line].state.height = roundUp(
          lines[line].state.height * 0.3937007874,
          1
        );
      }
      return;
    }
  };

  function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
  }

  if (output.length === lines.length && waiting) {
    console.log(`if ${output}`);
    for (let line = 0; line < lines.length; line++) {
      calculateChargeable(
        line,
        lines[line].state.pcs,
        lines[line].state.length,
        lines[line].state.width,
        lines[line].state.height
      );
    }
    convertDims();
    convertWeight();
    setWaiting(false);
  }

  return (
    <div className="mt-4">
      <nav className="flex flex-row justify-around w-screen mb-4">
        <h1 className="text-4xl font-bold mr-20">Freight Calculator</h1>

        <div>
          <label className="mr-4 font-bold">Log In:</label>
          <label>Email:</label>
          <input
            className="border rounded w-32 mr-4"
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password:</label>
          <input
            className="border rounded w-32 mr-4"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mr-6 border border-sky-300 rounded-md px-2 p-0.5 bg-sky-300 hover:bg-sky-200"
            onClick={(e) => handleLogIn(e)}
          >
            Log in
          </button>
          <Link
            className="mr-6 border border-emerald-400 rounded-md px-2  p-1 bg-emerald-400 hover:bg-emerald-300"
            to="/create_user"
          >
            Register
          </Link>
        </div>
      </nav>
      <main className="flex flex-col items-center">
        <form>
          <div>
            <label>Dimension Input Type:</label>
            <select
              className="m-1"
              name="dimensionType"
              value={dimensionType}
              onChange={(e) => setDimensionType(e.target.value)}
            >
              <option name="in" value="in">
                Inches
              </option>
              <option name="cm" value="cm">
                Centimeters
              </option>
            </select>
            <label className="m-1">Weight Input Type:</label>
            <select
              className="m-1"
              name="weightType"
              value={weightType}
              onChange={(e) => setWeightType(e.target.value)}
            >
              <option name="kgs" value="kgs">
                Kilos
              </option>
              <option name="lbs" value="lbs">
                Pounds
              </option>
            </select>
          </div>
          <table className="table-auto border">
            <thead>
              <tr className="">
                <th>#</th>
                <th>Number of Pcs</th>
                <th>Length</th>
                <th>Width</th>
                <th>Height</th>
                <th>Weight Per Pce:</th>
                <th>{weightType}</th>
              </tr>
            </thead>
            <tbody id="newLine">
              {lines.map((profile, index) => {
                return (
                  <tr className="odd:bg-slate-100" key={index}>
                    <th className="px-2">{index + 1}</th>
                    <td>
                      <input
                        className="dims pcs border-2 rounded"
                        type="number"
                        name="numberOfPcs"
                        id="numberOfPcs1"
                        value={lines[index].pcs}
                        placeholder="0"
                        onChange={(e) => handleChange(e, index, "pcs")}
                      />
                    </td>
                    <td>
                      <input
                        className="dims pcs border-2 rounded"
                        type="number"
                        name="length"
                        placeholder="0"
                        step="0.1"
                        value={lines[index].length}
                        onChange={(e) => handleChange(e, index, "length")}
                      />
                    </td>
                    <td>
                      <input
                        className="dims pcs border-2 rounded"
                        type="number"
                        name="width"
                        id="width1"
                        placeholder="0"
                        step="0.1"
                        value={lines[index].width}
                        onChange={(e) => handleChange(e, index, "width")}
                      />
                    </td>
                    <td>
                      <input
                        className="dims pcs border-2 rounded"
                        type="number"
                        name="height"
                        id="height1"
                        placeholder="0"
                        step="0.1"
                        value={lines[index].height}
                        onChange={(e) => handleChange(e, index, "height")}
                      />
                    </td>
                    <td>
                      <input
                        className="dims pcs border-2 rounded"
                        type="number"
                        name="weight"
                        id="weight1"
                        placeholder="0"
                        step="0.1"
                        value={lines[index].weight}
                        onChange={(e) => handleChange(e, index, "weight")}
                      />
                    </td>
                    <td className="px-2">{weightType}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="border border-blue-500 bg-blue-500 rounded-lg p-1 hover:shadow-lg hover:bg-blue-400 hover:border-blue-400"
            value="Add Lines"
            id="addLine"
            onClick={addLine}
          >
            Add Line
          </button>
          <button
            className="border bg-red-600 border-red-600 rounded-lg p-1 ml-2 mb-1 hover:bg-red-500 hover:border-red-500 hover:shadow-lg"
            onClick={(e) => removeLine(e)}
          >
            Remove Line
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setOutput([], setWait(wait + 1));
            }}
            className="border border-green-500 bg-green-500 rounded-lg p-1 ml-2 hover:shadow-lg hover:bg-green-400 hover:border-green-400"
          >
            Calculate
          </button>
        </form>
        <h3>Output</h3>
        <div>
          <label className="m-1">Dimension Output Type:</label>
          <select
            className="m-1"
            name="outputDims"
            id="outputDims"
            onChange={(e) => {
              setOutputDimensionType(e.target.value);
            }}
          >
            <option value="in">Inches</option>
            <option value="cm">Centimeters</option>
          </select>
          <label className="m-1">Weight Output Type:</label>
          <select
            className="m-1"
            name="outputWeight"
            id="outputWeight"
            onChange={(e) => setOutputWeightType(e.target.value)}
          >
            <option value="kgs">Kilos</option>
            <option value="lbs">Pounds</option>
          </select>
        </div>
        <table className="table-auto border">
          <thead>
            <tr>
              <th>#</th>
              <th>Number of Pcs</th>
              <th>Length</th>
              <th>Width</th>
              <th>Height</th>
              <th>Weight Per Pce</th>
              <th>Weight Total</th>
              <th>Chargeable Weight</th>
            </tr>
          </thead>
          <tbody className="chargeable">
            {output.map((line, index) => {
              return (
                <tr className="odd:bg-slate-100" key={index}>
                  <th className="px-2">{index + 1}</th>
                  <td>{output[index].state.pcs}</td>
                  <td>{output[index].state.length}</td>
                  <td>{output[index].state.width}</td>
                  <td>{output[index].state.height}</td>
                  <td>{output[index].state.weight}</td>
                  <td>
                    {roundUp(
                      output[index].state.weight * output[index].state.pcs,
                      1
                    )}
                  </td>
                  <td>{output[index].state.chargeable}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="totals">{handleTotals()}</div>
      </main>
    </div>
  );
};

export default PublicCalculator;
