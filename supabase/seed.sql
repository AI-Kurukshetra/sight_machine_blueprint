insert into public.facilities (id, name, location, active_shift)
values
  ('facility-atlas', 'Atlas Components Plant', 'Detroit, MI', 'Day Shift · 06:00-14:00'),
  ('facility-orion', 'Orion Plastics Hub', 'Austin, TX', 'Swing Shift · 14:00-22:00'),
  ('facility-nova', 'Nova Finishing Center', 'Columbus, OH', 'Night Shift · 22:00-06:00')
on conflict (id) do update
set name = excluded.name,
    location = excluded.location,
    active_shift = excluded.active_shift;

insert into public.production_lines (id, facility_id, name, status, oee, throughput, target_throughput, yield_rate)
values
  ('line-alpha', 'facility-atlas', 'Alpha Stamping', 'running', 93.2, 342, 360, 98.8),
  ('line-bravo', 'facility-atlas', 'Bravo Assembly', 'attention', 88.4, 274, 310, 97.1),
  ('line-charlie', 'facility-atlas', 'Charlie Packaging', 'maintenance', 81.7, 198, 250, 95.4),
  ('line-orion-1', 'facility-orion', 'Orion Extrusion', 'running', 92.1, 520, 540, 99.0),
  ('line-orion-2', 'facility-orion', 'Orion Molding', 'running', 91.4, 596, 610, 98.3),
  ('line-nova-1', 'facility-nova', 'Nova Coating', 'attention', 79.6, 392, 460, 95.7)
on conflict (id) do update
set facility_id = excluded.facility_id,
    name = excluded.name,
    status = excluded.status,
    oee = excluded.oee,
    throughput = excluded.throughput,
    target_throughput = excluded.target_throughput,
    yield_rate = excluded.yield_rate;

insert into public.equipment (id, line_id, name, type, status, health_score, utilization, energy_kw, last_service, digital_twin_state)
values
  ('eq-press-07', 'line-alpha', 'Servo Press 07', 'Stamping Press', 'running', 96, 91, 126, '2026-03-03T09:30:00Z', 'Nominal torque curve'),
  ('eq-robot-12', 'line-bravo', 'Robot Cell 12', 'Assembly Robot', 'warning', 78, 84, 98, '2026-02-19T11:15:00Z', 'Cycle time drift +4.1%'),
  ('eq-oven-03', 'line-charlie', 'Cure Oven 03', 'Thermal Process', 'maintenance', 63, 66, 154, '2026-01-28T14:45:00Z', 'Thermal imbalance detected'),
  ('eq-vision-04', 'line-bravo', 'Vision Station 04', 'Quality Inspection', 'running', 92, 88, 41, '2026-03-09T08:00:00Z', 'Inspection confidence stable')
on conflict (id) do update
set line_id = excluded.line_id,
    name = excluded.name,
    type = excluded.type,
    status = excluded.status,
    health_score = excluded.health_score,
    utilization = excluded.utilization,
    energy_kw = excluded.energy_kw,
    last_service = excluded.last_service,
    digital_twin_state = excluded.digital_twin_state;

insert into public.alerts (id, equipment_id, title, severity, category, status, summary, created_at)
values
  ('alert-001', 'eq-oven-03', 'Oven zone 2 overheating', 'critical', 'Process', 'open', 'Temperature exceeded tolerance band for 8 minutes. Quality risk is rising.', '2026-03-14T05:48:00Z'),
  ('alert-002', 'eq-robot-12', 'Assembly cycle drift', 'high', 'Performance', 'investigating', 'Predicted throughput miss of 11% if the current motion path remains unchanged.', '2026-03-14T04:22:00Z'),
  ('alert-003', 'eq-vision-04', 'Vision model confidence dip', 'medium', 'Quality', 'resolved', 'Lighting variation corrected after recalibration.', '2026-03-13T20:16:00Z')
on conflict (id) do update
set equipment_id = excluded.equipment_id,
    title = excluded.title,
    severity = excluded.severity,
    category = excluded.category,
    status = excluded.status,
    summary = excluded.summary,
    created_at = excluded.created_at;

insert into public.maintenance_predictions (id, equipment_id, issue, confidence, days_until_service, recommended_action)
values
  ('maint-001', 'eq-oven-03', 'Exhaust fan bearing wear', 91, 1, 'Inspect bearing assembly and replace fan cartridge during next planned stop.'),
  ('maint-002', 'eq-robot-12', 'Axis 3 servo backlash', 84, 4, 'Run backlash calibration and inspect coupling set screws.'),
  ('maint-003', 'eq-press-07', 'Hydraulic pressure ripple', 67, 9, 'Review accumulator charge level and monitor pressure variance trend.')
on conflict (id) do update
set equipment_id = excluded.equipment_id,
    issue = excluded.issue,
    confidence = excluded.confidence,
    days_until_service = excluded.days_until_service,
    recommended_action = excluded.recommended_action;

insert into public.quality_events (id, line_id, batch_code, defect_category, defect_rate, first_pass_yield, status, checked_at)
values
  ('quality-001', 'line-alpha', 'AT-240314-A', 'Surface blemish', 0.8, 99.1, 'stable', '2026-03-14T05:20:00Z'),
  ('quality-002', 'line-bravo', 'AT-240314-B', 'Fastener torque miss', 1.9, 97.3, 'watch', '2026-03-14T05:05:00Z'),
  ('quality-003', 'line-charlie', 'AT-240314-C', 'Cure variance', 3.7, 94.8, 'intervention', '2026-03-14T04:40:00Z')
on conflict (id) do update
set line_id = excluded.line_id,
    batch_code = excluded.batch_code,
    defect_category = excluded.defect_category,
    defect_rate = excluded.defect_rate,
    first_pass_yield = excluded.first_pass_yield,
    status = excluded.status,
    checked_at = excluded.checked_at;

insert into public.connector_statuses (id, facility_id, name, protocol, status, latency_ms, records_per_min, last_ingested_at, notes)
values
  ('conn-opcua-atlas', 'facility-atlas', 'Atlas OPC-UA Gateway', 'OPC-UA', 'healthy', 170, 4200, '2026-03-14T06:58:00Z', 'Primary PLC and press telemetry stream.'),
  ('conn-mqtt-orion', 'facility-orion', 'Orion Edge MQTT Broker', 'MQTT', 'degraded', 540, 2980, '2026-03-14T06:55:00Z', 'Intermittent packet delay from line 2 scanner cluster.'),
  ('conn-rest-nova', 'facility-nova', 'Nova MES REST Sync', 'REST', 'offline', 0, 0, '2026-03-14T04:12:00Z', 'MES token expired. Re-authentication required.')
on conflict (id) do update
set facility_id = excluded.facility_id,
    name = excluded.name,
    protocol = excluded.protocol,
    status = excluded.status,
    latency_ms = excluded.latency_ms,
    records_per_min = excluded.records_per_min,
    last_ingested_at = excluded.last_ingested_at,
    notes = excluded.notes;

insert into public.custom_kpis (id, facility_id, name, formula, target_value, current_value, unit)
values
  ('kpi-energy-per-unit', 'facility-atlas', 'Energy per Unit', 'total_energy_kwh / good_units', 2.3, 2.6, 'kWh/unit'),
  ('kpi-unplanned-downtime-rate', 'facility-atlas', 'Unplanned Downtime Rate', 'unplanned_minutes / shift_minutes', 5.0, 7.2, '%'),
  ('kpi-quality-cost-index', 'facility-atlas', 'Quality Cost Index', '(rework_cost + scrap_cost) / output_value', 3.5, 2.9, '%')
on conflict (id) do update
set facility_id = excluded.facility_id,
    name = excluded.name,
    formula = excluded.formula,
    target_value = excluded.target_value,
    current_value = excluded.current_value,
    unit = excluded.unit;

insert into public.anomaly_events (id, facility_id, equipment_id, signal, severity, anomaly_score, status, summary, detected_at)
values
  ('anomaly-001', 'facility-atlas', 'eq-robot-12', 'Cycle variance burst', 'high', 92, 'reviewing', 'Cycle variance exceeded baseline by 3.4 sigma for 11 consecutive runs.', '2026-03-14T06:42:00Z'),
  ('anomaly-002', 'facility-atlas', 'eq-oven-03', 'Thermal oscillation', 'critical', 97, 'new', 'Temperature control loop entered oscillation outside normal control bounds.', '2026-03-14T06:31:00Z'),
  ('anomaly-003', 'facility-orion', 'eq-orion-11', 'Sensor drift', 'medium', 68, 'resolved', 'Edge calibration recalibration restored normal signal profile.', '2026-03-14T05:09:00Z')
on conflict (id) do update
set facility_id = excluded.facility_id,
    equipment_id = excluded.equipment_id,
    signal = excluded.signal,
    severity = excluded.severity,
    anomaly_score = excluded.anomaly_score,
    status = excluded.status,
    summary = excluded.summary,
    detected_at = excluded.detected_at;

insert into public.historical_points (id, line_id, metric, value, recorded_at)
values
  ('hist-001', 'line-alpha', 'oee', 91.2, '2026-03-14T04:00:00Z'),
  ('hist-002', 'line-alpha', 'oee', 92.1, '2026-03-14T05:00:00Z'),
  ('hist-003', 'line-alpha', 'oee', 93.2, '2026-03-14T06:00:00Z'),
  ('hist-004', 'line-bravo', 'throughput', 252, '2026-03-14T04:00:00Z'),
  ('hist-005', 'line-bravo', 'throughput', 264, '2026-03-14T05:00:00Z'),
  ('hist-006', 'line-bravo', 'throughput', 274, '2026-03-14T06:00:00Z'),
  ('hist-007', 'line-charlie', 'defect_rate', 4.4, '2026-03-14T04:00:00Z'),
  ('hist-008', 'line-charlie', 'defect_rate', 4.0, '2026-03-14T05:00:00Z'),
  ('hist-009', 'line-charlie', 'defect_rate', 3.7, '2026-03-14T06:00:00Z')
on conflict (id) do update
set line_id = excluded.line_id,
    metric = excluded.metric,
    value = excluded.value,
    recorded_at = excluded.recorded_at;

insert into public.production_plans (id, facility_id, work_order, product, assigned_line, target_units, planned_start, planned_end, status)
values
  ('plan-001', 'facility-atlas', 'WO-AT-240314-01', 'Rotor Housing', 'line-alpha', 2400, '2026-03-14T06:00:00Z', '2026-03-14T14:00:00Z', 'in_progress'),
  ('plan-002', 'facility-atlas', 'WO-AT-240314-02', 'Actuator Bracket', 'line-bravo', 1800, '2026-03-14T07:00:00Z', '2026-03-14T15:00:00Z', 'scheduled'),
  ('plan-003', 'facility-nova', 'WO-NV-240314-05', 'Surface Seal Assembly', 'line-nova-1', 950, '2026-03-14T05:30:00Z', '2026-03-14T13:30:00Z', 'delayed')
on conflict (id) do update
set facility_id = excluded.facility_id,
    work_order = excluded.work_order,
    product = excluded.product,
    assigned_line = excluded.assigned_line,
    target_units = excluded.target_units,
    planned_start = excluded.planned_start,
    planned_end = excluded.planned_end,
    status = excluded.status;

insert into public.energy_records (id, facility_id, line_id, kwh, intensity_kwh_per_unit, peak_kw, recorded_at)
values
  ('energy-001', 'facility-atlas', 'line-alpha', 892, 2.4, 152, '2026-03-14T06:00:00Z'),
  ('energy-002', 'facility-atlas', 'line-bravo', 774, 2.8, 141, '2026-03-14T06:00:00Z'),
  ('energy-003', 'facility-orion', 'line-orion-2', 1104, 1.9, 188, '2026-03-14T06:00:00Z')
on conflict (id) do update
set facility_id = excluded.facility_id,
    line_id = excluded.line_id,
    kwh = excluded.kwh,
    intensity_kwh_per_unit = excluded.intensity_kwh_per_unit,
    peak_kw = excluded.peak_kw,
    recorded_at = excluded.recorded_at;

insert into public.inventory_items (id, sku, name, category, on_hand, wip, finished_goods, reorder_point, status)
values
  ('inv-001', 'RM-AL-221', 'Aluminum Coil 2.2mm', 'raw_material', 1480, 0, 0, 900, 'healthy'),
  ('inv-002', 'WIP-BR-100', 'Bracket Semi-Finished', 'wip', 0, 420, 0, 250, 'watch'),
  ('inv-003', 'FG-RH-500', 'Rotor Housing Final', 'finished_good', 320, 0, 320, 500, 'critical')
on conflict (id) do update
set sku = excluded.sku,
    name = excluded.name,
    category = excluded.category,
    on_hand = excluded.on_hand,
    wip = excluded.wip,
    finished_goods = excluded.finished_goods,
    reorder_point = excluded.reorder_point,
    status = excluded.status;

insert into public.operator_metrics (id, operator_name, shift, efficiency, safety_incidents, training_gap, status)
values
  ('op-001', 'Nina Patel', 'Day', 94, 0, 'low', 'strong'),
  ('op-002', 'Liam Chen', 'Swing', 86, 1, 'medium', 'watch'),
  ('op-003', 'Marta Rivera', 'Night', 78, 2, 'high', 'needs_support')
on conflict (id) do update
set operator_name = excluded.operator_name,
    shift = excluded.shift,
    efficiency = excluded.efficiency,
    safety_incidents = excluded.safety_incidents,
    training_gap = excluded.training_gap,
    status = excluded.status;

insert into public.optimization_recommendations (id, line_id, parameter, current_value, recommended_value, expected_gain_percent, confidence, status)
values
  ('opt-001', 'line-alpha', 'Press force setpoint', 72, 69, 3.4, 87, 'ready'),
  ('opt-002', 'line-bravo', 'Robot dwell time', 1.8, 1.5, 6.9, 83, 'testing'),
  ('opt-003', 'line-charlie', 'Oven zone 2 temp', 214, 208, 4.1, 79, 'applied')
on conflict (id) do update
set line_id = excluded.line_id,
    parameter = excluded.parameter,
    current_value = excluded.current_value,
    recommended_value = excluded.recommended_value,
    expected_gain_percent = excluded.expected_gain_percent,
    confidence = excluded.confidence,
    status = excluded.status;

insert into public.root_cause_cases (id, alert_id, issue, probable_cause, confidence, recommended_action, status)
values
  ('rca-001', 'alert-001', 'Oven zone 2 overheating', 'Exhaust fan bearing wear causing reduced airflow.', 91, 'Replace fan cartridge and re-balance zone control loop.', 'open'),
  ('rca-002', 'alert-002', 'Assembly cycle drift', 'Axis 3 backlash after extended high-load sequence.', 84, 'Run calibration routine and inspect coupling.', 'validated')
on conflict (id) do update
set alert_id = excluded.alert_id,
    issue = excluded.issue,
    probable_cause = excluded.probable_cause,
    confidence = excluded.confidence,
    recommended_action = excluded.recommended_action,
    status = excluded.status;

insert into public.shift_handover_reports (id, facility_id, shift_name, start_at, end_at, summary, oee, throughput, incidents, handover_note)
values
  ('shift-001', 'facility-atlas', 'Day Shift', '2026-03-14T06:00:00Z', '2026-03-14T14:00:00Z', 'Stable output with one critical thermal escalation handled in progress.', 89.4, 814, 1, 'Prioritize oven airflow inspection at 14:30 maintenance window.'),
  ('shift-002', 'facility-orion', 'Swing Shift', '2026-03-14T14:00:00Z', '2026-03-14T22:00:00Z', 'Strong throughput, one connector degradation under monitoring.', 91.7, 1116, 0, 'Verify MQTT broker packet loss after shift start.')
on conflict (id) do update
set facility_id = excluded.facility_id,
    shift_name = excluded.shift_name,
    start_at = excluded.start_at,
    end_at = excluded.end_at,
    summary = excluded.summary,
    oee = excluded.oee,
    throughput = excluded.throughput,
    incidents = excluded.incidents,
    handover_note = excluded.handover_note;

insert into public.compliance_entries (id, standard, area, owner, due_date, status, evidence_link)
values
  ('comp-001', 'ISO 9001', 'Quality management', 'QA Lead', '2026-03-30', 'compliant', 'https://example.com/evidence/iso9001'),
  ('comp-002', 'OSHA 1910', 'Machine guarding', 'Safety Manager', '2026-03-20', 'at_risk', 'https://example.com/evidence/osha1910'),
  ('comp-003', 'FDA 21 CFR Part 11', 'Electronic records', 'Compliance Officer', '2026-03-18', 'non_compliant', 'https://example.com/evidence/part11')
on conflict (id) do update
set standard = excluded.standard,
    area = excluded.area,
    owner = excluded.owner,
    due_date = excluded.due_date,
    status = excluded.status,
    evidence_link = excluded.evidence_link;

insert into public.genealogy_records (id, batch_code, product, parent_batch, equipment_path, quality_status, started_at, completed_at)
values
  ('gen-001', 'AT-240314-A', 'Rotor Housing', 'RM-AL-221-778', 'Servo Press 07 -> Robot Cell 12 -> Vision Station 04', 'pass', '2026-03-14T04:10:00Z', '2026-03-14T05:52:00Z'),
  ('gen-002', 'AT-240314-C', 'Seal Assembly', 'RM-SEAL-443-102', 'Robot Cell 12 -> Cure Oven 03 -> Vision Station 04', 'hold', '2026-03-14T04:24:00Z', '2026-03-14T06:05:00Z')
on conflict (id) do update
set batch_code = excluded.batch_code,
    product = excluded.product,
    parent_batch = excluded.parent_batch,
    equipment_path = excluded.equipment_path,
    quality_status = excluded.quality_status,
    started_at = excluded.started_at,
    completed_at = excluded.completed_at;

insert into public.spc_samples (id, line_id, parameter, sample_value, mean, lcl, ucl, status, sampled_at)
values
  ('spc-001', 'line-alpha', 'Press thickness', 2.24, 2.2, 2.1, 2.3, 'in_control', '2026-03-14T06:45:00Z'),
  ('spc-002', 'line-bravo', 'Torque output', 41.8, 40.0, 37.5, 42.0, 'warning', '2026-03-14T06:47:00Z'),
  ('spc-003', 'line-charlie', 'Cure temperature', 216.4, 208.0, 203.0, 214.0, 'out_of_control', '2026-03-14T06:49:00Z')
on conflict (id) do update
set line_id = excluded.line_id,
    parameter = excluded.parameter,
    sample_value = excluded.sample_value,
    mean = excluded.mean,
    lcl = excluded.lcl,
    ucl = excluded.ucl,
    status = excluded.status,
    sampled_at = excluded.sampled_at;

insert into public.advanced_feature_modules (
  id,
  slug,
  name,
  description,
  priority,
  complexity,
  adoption_percent,
  latency_ms,
  roi_percent,
  status,
  recommendation
)
values
  ('adv-001', 'ai-powered-production-optimization', 'AI-Powered Production Optimization', 'Continuously optimizes schedules and resource allocation against real-time plant constraints.', 'innovative', 'high', 44, 420, 11.8, 'pilot', 'Roll out in Atlas + Orion with closed-loop schedule controls.'),
  ('adv-002', 'augmented-reality-maintenance', 'Augmented Reality Maintenance', 'AR-guided maintenance workflows with real-time equipment overlays.', 'innovative', 'high', 27, 180, 8.2, 'pilot', 'Start with thermal and robotic asset classes for highest downtime reduction.'),
  ('adv-003', 'digital-factory-simulation', 'Digital Factory Simulation', 'What-if process simulation on digital twin models prior to physical changes.', 'important', 'high', 52, 900, 13.4, 'active', 'Use for weekly planning and process change reviews.'),
  ('adv-004', 'autonomous-quality-control', 'Autonomous Quality Control', 'Computer-vision defect detection and classification at line speed.', 'important', 'high', 49, 140, 12.1, 'active', 'Expand model coverage to packaging and finishing stations.'),
  ('adv-005', 'supply-chain-integration', 'Supply Chain Integration', 'Supplier visibility and synchronized material risk monitoring.', 'important', 'high', 41, 680, 9.8, 'pilot', 'Prioritize critical suppliers with high stockout impact.'),
  ('adv-006', 'edge-ai-processing', 'Edge AI Processing', 'Low-latency model execution directly on factory-floor devices.', 'innovative', 'high', 36, 28, 10.7, 'active', 'Move anomaly and quality classifiers to edge nodes where feasible.'),
  ('adv-007', 'natural-language-query-interface', 'Natural Language Query Interface', 'Conversational interface for querying production and quality metrics.', 'innovative', 'high', 31, 520, 7.9, 'pilot', 'Enable governed prompts for plant managers first.'),
  ('adv-008', 'blockchain-quality-certificates', 'Blockchain Quality Certificates', 'Immutable provenance and quality certificates for downstream trust.', 'innovative', 'high', 19, 1500, 4.5, 'planned', 'Restrict to regulated products where audit value is highest.'),
  ('adv-009', 'collaborative-robot-integration', 'Collaborative Robot Integration', 'Direct cobot coordination and performance tuning with line controls.', 'important', 'high', 46, 95, 9.2, 'active', 'Synchronize cobot cycle models with line throughput planning.'),
  ('adv-010', 'carbon-footprint-tracking', 'Carbon Footprint Tracking', 'Real-time emissions and sustainability impact accounting by process.', 'important', 'medium', 58, 260, 6.7, 'active', 'Integrate energy + production intensity into monthly ESG reporting.'),
  ('adv-011', 'advanced-process-mining', 'Advanced Process Mining', 'AI-assisted bottleneck discovery and hidden flow inefficiency detection.', 'important', 'high', 33, 740, 10.9, 'pilot', 'Run weekly mining jobs and route top issues to RCA workflows.'),
  ('adv-012', 'federated-learning-platform', 'Federated Learning Platform', 'Cross-site collaborative model training without sharing raw data.', 'innovative', 'high', 22, 1240, 8.6, 'planned', 'Launch with predictive maintenance models across Atlas + Nova.')
on conflict (id) do update
set slug = excluded.slug,
    name = excluded.name,
    description = excluded.description,
    priority = excluded.priority,
    complexity = excluded.complexity,
    adoption_percent = excluded.adoption_percent,
    latency_ms = excluded.latency_ms,
    roi_percent = excluded.roi_percent,
    status = excluded.status,
    recommendation = excluded.recommendation;

insert into public.innovation_ideas (id, title, summary, impact_score, horizon, readiness)
values
  ('idea-001', 'Autonomous Factory Orchestration', 'Self-optimizing scheduling and dispatching in real time across lines.', 95, 'mid_term', 'prototype'),
  ('idea-002', 'Predictive Demand-Coupled Planning', 'Demand forecasts auto-adjust production planning to reduce waste.', 88, 'near_term', 'prototype'),
  ('idea-003', 'Cross-Industry Benchmarking Network', 'Anonymous peer benchmarking for OEE, quality, and sustainability metrics.', 81, 'mid_term', 'concept'),
  ('idea-004', 'VR Factory Training Simulator', 'Immersive skill development with scenario-based operator training.', 74, 'mid_term', 'concept'),
  ('idea-005', 'Quantum Optimization Integration', 'Hybrid optimization engines for very large, constrained scheduling problems.', 67, 'long_term', 'concept'),
  ('idea-006', 'AI-Generated Maintenance Procedures', 'Condition-aware dynamic SOP generation from failure patterns.', 83, 'near_term', 'prototype'),
  ('idea-007', 'Machine Social Insight Network', 'Equipment-to-equipment sharing of performance and failure signatures.', 72, 'long_term', 'concept'),
  ('idea-008', 'Capacity Exchange Marketplace', 'Trusted platform for exchanging excess production capacity.', 78, 'mid_term', 'concept'),
  ('idea-009', 'AI Sustainability Advisor', 'Generates eco-efficient process modifications with quantified tradeoffs.', 86, 'near_term', 'prototype'),
  ('idea-010', 'Adaptive Compliance Copilot', 'Automatically maps changing regulations to plant evidence requirements.', 84, 'near_term', 'prototype'),
  ('idea-011', 'Predictive Workforce Planning', 'Anticipates skill gaps and recommends targeted training paths.', 79, 'mid_term', 'validated'),
  ('idea-012', 'Plug-and-Play Manufacturing Microservices', 'Composable app marketplace architecture for fast capability expansion.', 82, 'near_term', 'prototype')
on conflict (id) do update
set title = excluded.title,
    summary = excluded.summary,
    impact_score = excluded.impact_score,
    horizon = excluded.horizon,
    readiness = excluded.readiness;
