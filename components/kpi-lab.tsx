"use client";

import { useMemo, useState } from "react";

import { formatNumber } from "@/lib/utils";

type MetricKey = "throughput" | "quality" | "downtime" | "energy";
type Operator = "+" | "-" | "*" | "/";

type KpiLabProps = {
  baseline: Record<MetricKey, number>;
};

const labels: Record<MetricKey, string> = {
  throughput: "Throughput",
  quality: "Quality %",
  downtime: "Downtime (min)",
  energy: "Energy (kW)",
};

export function KpiLab({ baseline }: KpiLabProps) {
  const [leftMetric, setLeftMetric] = useState<MetricKey>("throughput");
  const [rightMetric, setRightMetric] = useState<MetricKey>("downtime");
  const [operator, setOperator] = useState<Operator>("/");
  const [multiplier, setMultiplier] = useState("1");
  const [target, setTarget] = useState("90");

  const computed = useMemo(() => {
    const left = baseline[leftMetric];
    const right = baseline[rightMetric];
    const factor = Number(multiplier) || 1;
    const targetValue = Number(target) || 0;

    let result = 0;

    if (operator === "+") {
      result = left + right;
    } else if (operator === "-") {
      result = left - right;
    } else if (operator === "*") {
      result = left * right;
    } else {
      result = right === 0 ? 0 : left / right;
    }

    result *= factor;

    return {
      value: result,
      formula: `${leftMetric} ${operator} ${rightMetric} * ${factor}`,
      targetValue,
      delta: result - targetValue,
    };
  }, [baseline, leftMetric, operator, rightMetric, multiplier, target]);

  return (
    <div className="panel kpi-lab">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Formula playground</p>
          <h2>Custom KPI Builder</h2>
        </div>
        <span className={`pill ${computed.delta >= 0 ? "pill-positive" : "pill-warning"}`}>
          {computed.delta >= 0 ? "On target" : "Below target"}
        </span>
      </div>

      <div className="kpi-form-grid">
        <label className="field">
          Left metric
          <select value={leftMetric} onChange={(event) => setLeftMetric(event.target.value as MetricKey)}>
            {Object.entries(labels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          Operator
          <select value={operator} onChange={(event) => setOperator(event.target.value as Operator)}>
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
        </label>

        <label className="field">
          Right metric
          <select value={rightMetric} onChange={(event) => setRightMetric(event.target.value as MetricKey)}>
            {Object.entries(labels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          Multiplier
          <input value={multiplier} onChange={(event) => setMultiplier(event.target.value)} type="number" />
        </label>

        <label className="field">
          Target
          <input value={target} onChange={(event) => setTarget(event.target.value)} type="number" />
        </label>
      </div>

      <div className="kpi-result">
        <p className="eyebrow">Formula</p>
        <strong>{computed.formula}</strong>
        <p>
          Value: <strong>{formatNumber(Number(computed.value.toFixed(2)))}</strong>
        </p>
        <p>
          Delta vs target:{" "}
          <strong className={computed.delta >= 0 ? "metric-positive" : "metric-warning"}>
            {computed.delta >= 0 ? "+" : ""}
            {computed.delta.toFixed(2)}
          </strong>
        </p>
      </div>
    </div>
  );
}
