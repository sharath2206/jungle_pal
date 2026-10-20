import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import confetti from 'canvas-confetti';
import { colors, borderRadius } from '../theme/colors';
import { typography } from '../theme/typography';
import { sounds } from '../theme/sounds';
import { SquishyButton } from './SquishyButton';

// Complete, bespoke stroke geometry and checkpoint definitions for all 26 uppercase letters
export const LETTER_STROKE_DATA = {
  A: {
    strokes: [
      { name: 'Left Slant', instruction: 'Draw down the left side ↙️', points: [{ x: 0.50, y: 0.18 }, { x: 0.24, y: 0.82 }] },
      { name: 'Right Slant', instruction: 'Draw down the right side ↘️', points: [{ x: 0.50, y: 0.18 }, { x: 0.76, y: 0.82 }] },
      { name: 'Crossbar', instruction: 'Bridge across the middle ➡️', points: [{ x: 0.34, y: 0.56 }, { x: 0.66, y: 0.56 }] },
    ],
  },
  B: {
    strokes: [
      { name: 'Spine', instruction: 'Draw straight down ⬇️', points: [{ x: 0.30, y: 0.18 }, { x: 0.30, y: 0.82 }] },
      { name: 'Top Loop', instruction: 'Curve around the top ↪️', points: [{ x: 0.30, y: 0.18 }, { x: 0.62, y: 0.18 }, { x: 0.68, y: 0.34 }, { x: 0.60, y: 0.50 }, { x: 0.30, y: 0.50 }] },
      { name: 'Bottom Loop', instruction: 'Curve around the bottom ↪️', points: [{ x: 0.30, y: 0.50 }, { x: 0.66, y: 0.50 }, { x: 0.72, y: 0.66 }, { x: 0.62, y: 0.82 }, { x: 0.30, y: 0.82 }] },
    ],
  },
  C: {
    strokes: [
      { name: 'Curve', instruction: 'Curve all the way around 🔄', points: [{ x: 0.74, y: 0.28 }, { x: 0.52, y: 0.18 }, { x: 0.28, y: 0.34 }, { x: 0.24, y: 0.50 }, { x: 0.28, y: 0.66 }, { x: 0.52, y: 0.82 }, { x: 0.74, y: 0.72 }] },
    ],
  },
  D: {
    strokes: [
      { name: 'Spine', instruction: 'Draw straight down ⬇️', points: [{ x: 0.30, y: 0.18 }, { x: 0.30, y: 0.82 }] },
      { name: 'Big Curve', instruction: 'Curve big from top to bottom ↪️', points: [{ x: 0.30, y: 0.18 }, { x: 0.62, y: 0.18 }, { x: 0.76, y: 0.38 }, { x: 0.76, y: 0.62 }, { x: 0.62, y: 0.82 }, { x: 0.30, y: 0.82 }] },
    ],
  },
  E: {
    strokes: [
      { name: 'Spine', instruction: 'Draw straight down ⬇️', points: [{ x: 0.30, y: 0.18 }, { x: 0.30, y: 0.82 }] },
      { name: 'Top Bar', instruction: 'Draw top bar ➡️', points: [{ x: 0.30, y: 0.18 }, { x: 0.72, y: 0.18 }] },
      { name: 'Mid Bar', instruction: 'Draw middle bar ➡️', points: [{ x: 0.30, y: 0.50 }, { x: 0.62, y: 0.50 }] },
      { name: 'Bottom Bar', instruction: 'Draw bottom bar ➡️', points: [{ x: 0.30, y: 0.82 }, { x: 0.72, y: 0.82 }] },
    ],
  },
  F: {
    strokes: [
      { name: 'Spine', instruction: 'Draw straight down ⬇️', points: [{ x: 0.30, y: 0.18 }, { x: 0.30, y: 0.82 }] },
      { name: 'Top Bar', instruction: 'Draw top bar ➡️', points: [{ x: 0.30, y: 0.18 }, { x: 0.72, y: 0.18 }] },
      { name: 'Mid Bar', instruction: 'Draw middle bar ➡️', points: [{ x: 0.30, y: 0.50 }, { x: 0.60, y: 0.50 }] },
    ],
  },
  G: {
    strokes: [
      { name: 'Big Arc', instruction: 'Curve around the outside 🔄', points: [{ x: 0.74, y: 0.28 }, { x: 0.52, y: 0.18 }, { x: 0.28, y: 0.34 }, { x: 0.24, y: 0.50 }, { x: 0.28, y: 0.66 }, { x: 0.52, y: 0.82 }, { x: 0.74, y: 0.66 }, { x: 0.56, y: 0.66 }] },
    ],
  },
  H: {
    strokes: [
      { name: 'Left Line', instruction: 'Draw left line down ⬇️', points: [{ x: 0.28, y: 0.18 }, { x: 0.28, y: 0.82 }] },
      { name: 'Right Line', instruction: 'Draw right line down ⬇️', points: [{ x: 0.72, y: 0.18 }, { x: 0.72, y: 0.82 }] },
      { name: 'Crossbar', instruction: 'Connect across the middle ➡️', points: [{ x: 0.28, y: 0.50 }, { x: 0.72, y: 0.50 }] },
    ],
  },
  I: {
    strokes: [
      { name: 'Spine', instruction: 'Draw straight down ⬇️', points: [{ x: 0.50, y: 0.18 }, { x: 0.50, y: 0.82 }] },
      { name: 'Top Bar', instruction: 'Top cap ➡️', points: [{ x: 0.34, y: 0.18 }, { x: 0.66, y: 0.18 }] },
      { name: 'Bottom Bar', instruction: 'Bottom cap ➡️', points: [{ x: 0.34, y: 0.82 }, { x: 0.66, y: 0.82 }] },
    ],
  },
  J: {
    strokes: [
      { name: 'Hook', instruction: 'Draw down and hook up ↪️', points: [{ x: 0.62, y: 0.18 }, { x: 0.62, y: 0.66 }, { x: 0.52, y: 0.82 }, { x: 0.34, y: 0.72 }] },
      { name: 'Top Bar', instruction: 'Draw top bar ➡️', points: [{ x: 0.40, y: 0.18 }, { x: 0.74, y: 0.18 }] },
    ],
  },
  K: {
    strokes: [
      { name: 'Spine', instruction: 'Draw straight down ⬇️', points: [{ x: 0.32, y: 0.18 }, { x: 0.32, y: 0.82 }] },
      { name: 'Upper Slant', instruction: 'Draw slant in to middle ↙️', points: [{ x: 0.72, y: 0.20 }, { x: 0.32, y: 0.52 }] },
      { name: 'Lower Slant', instruction: 'Draw slant out to bottom ↘️', points: [{ x: 0.32, y: 0.52 }, { x: 0.74, y: 0.82 }] },
    ],
  },
  L: {
    strokes: [
      { name: 'Line Down', instruction: 'Draw straight down ⬇️', points: [{ x: 0.35, y: 0.18 }, { x: 0.35, y: 0.78 }] },
      { name: 'Line Across', instruction: 'Slide straight across ➡️', points: [{ x: 0.35, y: 0.78 }, { x: 0.75, y: 0.78 }] },
    ],
  },
  M: {
    strokes: [
      { name: 'Left Line', instruction: 'Draw left line down ⬇️', points: [{ x: 0.24, y: 0.18 }, { x: 0.24, y: 0.82 }] },
      { name: 'Left Slant', instruction: 'Slant to middle ↘️', points: [{ x: 0.24, y: 0.18 }, { x: 0.50, y: 0.60 }] },
      { name: 'Right Slant', instruction: 'Slant back up ↗️', points: [{ x: 0.50, y: 0.60 }, { x: 0.76, y: 0.18 }] },
      { name: 'Right Line', instruction: 'Draw right line down ⬇️', points: [{ x: 0.76, y: 0.18 }, { x: 0.76, y: 0.82 }] },
    ],
  },
  N: {
    strokes: [
      { name: 'Left Line', instruction: 'Draw left line down ⬇️', points: [{ x: 0.28, y: 0.18 }, { x: 0.28, y: 0.82 }] },
      { name: 'Diagonal', instruction: 'Slant down across ↘️', points: [{ x: 0.28, y: 0.18 }, { x: 0.72, y: 0.82 }] },
      { name: 'Right Line', instruction: 'Draw right line up ⬆️', points: [{ x: 0.72, y: 0.82 }, { x: 0.72, y: 0.18 }] },
    ],
  },
  O: {
    strokes: [
      { name: 'Circle', instruction: 'Trace all the way around the circle 🔄', points: [{ x: 0.50, y: 0.18 }, { x: 0.26, y: 0.32 }, { x: 0.22, y: 0.50 }, { x: 0.26, y: 0.68 }, { x: 0.50, y: 0.82 }, { x: 0.74, y: 0.68 }, { x: 0.78, y: 0.50 }, { x: 0.74, y: 0.32 }, { x: 0.50, y: 0.18 }] },
    ],
  },
  P: {
    strokes: [
      { name: 'Spine', instruction: 'Draw straight down ⬇️', points: [{ x: 0.32, y: 0.18 }, { x: 0.32, y: 0.82 }] },
      { name: 'Loop', instruction: 'Curve around the top ↪️', points: [{ x: 0.32, y: 0.18 }, { x: 0.66, y: 0.18 }, { x: 0.74, y: 0.35 }, { x: 0.66, y: 0.52 }, { x: 0.32, y: 0.52 }] },
    ],
  },
  Q: {
    strokes: [
      { name: 'Circle', instruction: 'Trace around the circle 🔄', points: [{ x: 0.50, y: 0.18 }, { x: 0.26, y: 0.32 }, { x: 0.22, y: 0.50 }, { x: 0.26, y: 0.68 }, { x: 0.50, y: 0.82 }, { x: 0.74, y: 0.68 }, { x: 0.78, y: 0.50 }, { x: 0.74, y: 0.32 }, { x: 0.50, y: 0.18 }] },
      { name: 'Tail', instruction: 'Draw the tail slant ↘️', points: [{ x: 0.56, y: 0.64 }, { x: 0.78, y: 0.84 }] },
    ],
  },
  R: {
    strokes: [
      { name: 'Spine', instruction: 'Draw straight down ⬇️', points: [{ x: 0.32, y: 0.18 }, { x: 0.32, y: 0.82 }] },
      { name: 'Loop', instruction: 'Curve around the top ↪️', points: [{ x: 0.32, y: 0.18 }, { x: 0.66, y: 0.18 }, { x: 0.74, y: 0.34 }, { x: 0.66, y: 0.50 }, { x: 0.32, y: 0.50 }] },
      { name: 'Leg', instruction: 'Slant the leg out ↘️', points: [{ x: 0.52, y: 0.50 }, { x: 0.74, y: 0.82 }] },
    ],
  },
  S: {
    strokes: [
      { name: 'Curve', instruction: 'Curve like a snake 🐍', points: [{ x: 0.70, y: 0.28 }, { x: 0.50, y: 0.18 }, { x: 0.30, y: 0.32 }, { x: 0.50, y: 0.50 }, { x: 0.70, y: 0.68 }, { x: 0.50, y: 0.82 }, { x: 0.28, y: 0.72 }] },
    ],
  },
  T: {
    strokes: [
      { name: 'Top Bar', instruction: 'Draw top bar across ➡️', points: [{ x: 0.22, y: 0.18 }, { x: 0.78, y: 0.18 }] },
      { name: 'Spine', instruction: 'Draw center line down ⬇️', points: [{ x: 0.50, y: 0.18 }, { x: 0.50, y: 0.82 }] },
    ],
  },
  U: {
    strokes: [
      { name: 'Cup', instruction: 'Draw down, curve, and back up 🔄', points: [{ x: 0.28, y: 0.18 }, { x: 0.28, y: 0.64 }, { x: 0.50, y: 0.82 }, { x: 0.72, y: 0.64 }, { x: 0.72, y: 0.18 }] },
    ],
  },
  V: {
    strokes: [
      { name: 'Left Slant', instruction: 'Slant down to the point ↘️', points: [{ x: 0.24, y: 0.18 }, { x: 0.50, y: 0.82 }] },
      { name: 'Right Slant', instruction: 'Slant back up ↗️', points: [{ x: 0.50, y: 0.82 }, { x: 0.76, y: 0.18 }] },
    ],
  },
  W: {
    strokes: [
      { name: 'Slant 1', instruction: 'Slant down ↘️', points: [{ x: 0.20, y: 0.18 }, { x: 0.35, y: 0.82 }] },
      { name: 'Slant 2', instruction: 'Slant up ↗️', points: [{ x: 0.35, y: 0.82 }, { x: 0.50, y: 0.40 }] },
      { name: 'Slant 3', instruction: 'Slant down ↘️', points: [{ x: 0.50, y: 0.40 }, { x: 0.65, y: 0.82 }] },
      { name: 'Slant 4', instruction: 'Slant up ↗️', points: [{ x: 0.65, y: 0.82 }, { x: 0.80, y: 0.18 }] },
    ],
  },
  X: {
    strokes: [
      { name: 'Slant 1', instruction: 'Slant across ↘️', points: [{ x: 0.26, y: 0.20 }, { x: 0.74, y: 0.80 }] },
      { name: 'Slant 2', instruction: 'Slant across other way ↙️', points: [{ x: 0.74, y: 0.20 }, { x: 0.26, y: 0.80 }] },
    ],
  },
  Y: {
    strokes: [
      { name: 'Left Branch', instruction: 'Slant to center ↘️', points: [{ x: 0.26, y: 0.18 }, { x: 0.50, y: 0.48 }] },
      { name: 'Right Branch', instruction: 'Slant to center ↙️', points: [{ x: 0.74, y: 0.18 }, { x: 0.50, y: 0.48 }] },
      { name: 'Stem', instruction: 'Draw stem down ⬇️', points: [{ x: 0.50, y: 0.48 }, { x: 0.50, y: 0.82 }] },
    ],
  },
  Z: {
    strokes: [
      { name: 'Top Bar', instruction: 'Slide across top ➡️', points: [{ x: 0.26, y: 0.20 }, { x: 0.74, y: 0.20 }] },
      { name: 'Diagonal', instruction: 'Slant down to bottom-left ↙️', points: [{ x: 0.74, y: 0.20 }, { x: 0.26, y: 0.80 }] },
      { name: 'Bottom Bar', instruction: 'Slide across bottom ➡️', points: [{ x: 0.26, y: 0.80 }, { x: 0.74, y: 0.80 }] },
    ],
  },
};

// Distance calculation helpers
function distToSegment(p, v, w) {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

function minDistanceToStroke(point, strokePoints, width, height) {
  let minDist = Infinity;
  for (let i = 0; i < strokePoints.length - 1; i++) {
    const v = { x: strokePoints[i].x * width, y: strokePoints[i].y * height };
    const w = { x: strokePoints[i + 1].x * width, y: strokePoints[i + 1].y * height };
    const d = distToSegment(point, v, w);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

function generateDenseWaypoints(points, width, height, step = 14) {
  const result = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = { x: points[i].x * width, y: points[i].y * height };
    const p2 = { x: points[i + 1].x * width, y: points[i + 1].y * height };
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const count = Math.max(1, Math.round(dist / step));
    for (let k = 0; k < count; k++) {
      const t = k / count;
      result.push({ x: p1.x + dx * t, y: p1.y + dy * t });
    }
  }
  const last = points[points.length - 1];
  result.push({ x: last.x * width, y: last.y * height });
  return result;
}

export const LetterTracer = ({ visible, onClose, letter = 'L', onComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [offPathWarning, setOffPathWarning] = useState(false);

  // Active stroke waypoints hit index
  const checkpointIdxRef = useRef(0);
  const denseWaypointsRef = useRef([]);
  const strokeHistoryRef = useRef([]); // Points drawn by user

  const letterKey = (letter || 'L').toUpperCase();
  const letterData = LETTER_STROKE_DATA[letterKey] || LETTER_STROKE_DATA.L;
  const totalStrokes = letterData.strokes.length;

  useEffect(() => {
    if (!visible) {
      setActiveStrokeIdx(0);
      setCompletedStrokes([]);
      setIsCompleted(false);
      setOffPathWarning(false);
      checkpointIdxRef.current = 0;
      denseWaypointsRef.current = [];
      strokeHistoryRef.current = [];
      return;
    }

    const timer = setTimeout(() => {
      resetTracerState();
    }, 120);

    return () => clearTimeout(timer);
  }, [visible, letterKey]);

  const resetTracerState = () => {
    setActiveStrokeIdx(0);
    setCompletedStrokes([]);
    setIsCompleted(false);
    setOffPathWarning(false);
    checkpointIdxRef.current = 0;
    strokeHistoryRef.current = [];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    // Generate dense waypoints for first stroke
    denseWaypointsRef.current = generateDenseWaypoints(letterData.strokes[0].points, width, height);

    redrawCanvas();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw all completed strokes in bright emerald green
    completedStrokes.forEach((strokeIdx) => {
      const stroke = letterData.strokes[strokeIdx];
      ctx.save();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 26;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([]);
      ctx.beginPath();
      stroke.points.forEach((pt, i) => {
        const px = pt.x * width;
        const py = pt.y * height;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.restore();
    });

    // 2. Draw upcoming (uncompleted & not active) strokes in light grey dashed guide
    letterData.strokes.forEach((stroke, idx) => {
      if (completedStrokes.includes(idx) || idx === activeStrokeIdx) return;
      ctx.save();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      stroke.points.forEach((pt, i) => {
        const px = pt.x * width;
        const py = pt.y * height;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.restore();
    });

    // 3. Draw ACTIVE stroke in golden dashed guide with start / end marker dots
    if (activeStrokeIdx < letterData.strokes.length && !isCompleted) {
      const activeStroke = letterData.strokes[activeStrokeIdx];
      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 26;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.setLineDash([10, 14]);
      ctx.beginPath();
      activeStroke.points.forEach((pt, i) => {
        const px = pt.x * width;
        const py = pt.y * height;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Start circle marker (green pulse)
      const startPt = activeStroke.points[0];
      ctx.setLineDash([]);
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(startPt.x * width, startPt.y * height, 15, 0, Math.PI * 2);
      ctx.fill();

      // Inner white star dot
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(startPt.x * width, startPt.y * height, 6, 0, Math.PI * 2);
      ctx.fill();

      // End circle marker (amber star)
      const endPt = activeStroke.points[activeStroke.points.length - 1];
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(endPt.x * width, endPt.y * height, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 4. Redraw user finger paint trail
    if (strokeHistoryRef.current.length > 0) {
      ctx.save();
      ctx.fillStyle = colors.primaryContainer;
      ctx.shadowColor = colors.secondaryContainer;
      ctx.shadowBlur = 8;
      strokeHistoryRef.current.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  };

  const startDrawing = (e) => {
    e.preventDefault();
    if (isCompleted) return;
    setIsDrawing(true);
    handleDraw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    strokeHistoryRef.current = [];
  };

  const handleDraw = (e) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    if (isCompleted || activeStrokeIdx >= totalStrokes) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = canvas.width;
    const height = canvas.height;

    const clientX =
      e.touches && e.touches.length > 0
        ? e.touches[0].clientX
        : e.clientX || 0;
    const clientY =
      e.touches && e.touches.length > 0
        ? e.touches[0].clientY
        : e.clientY || 0;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const currentStroke = letterData.strokes[activeStrokeIdx];
    if (!currentStroke) return;

    // Strict containment tolerance: 38px (allows children fingers but stops scribbling outside)
    const TOLERANCE_RADIUS = 38;
    const dist = minDistanceToStroke({ x, y }, currentStroke.points, width, height);

    if (dist > TOLERANCE_RADIUS) {
      // OFF-PATH SCRIBBLING DETECTED!
      // Do NOT advance any checkpoints or completion counters.
      if (!offPathWarning) {
        setOffPathWarning(true);
        setTimeout(() => setOffPathWarning(false), 600);
      }
      return;
    }

    // Point is on path! Add to history and draw glow dot
    strokeHistoryRef.current.push({ x, y });
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = colors.primaryContainer;
    ctx.shadowColor = colors.secondaryContainer;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Checkpoint hit testing
    const waypoints = denseWaypointsRef.current;
    const currentIdx = checkpointIdxRef.current;

    if (currentIdx < waypoints.length) {
      const targetWp = waypoints[currentIdx];
      const wpDist = Math.hypot(x - targetWp.x, y - targetWp.y);

      // Hit checkpoint if within 30px
      if (wpDist <= 30) {
        checkpointIdxRef.current += 1;
        if (checkpointIdxRef.current % 4 === 0) {
          sounds.playPop();
        }
      }
    }

    // Check if stroke reached threshold (85% of waypoints hit in sequence)
    const requiredHits = Math.floor(waypoints.length * 0.85);
    if (checkpointIdxRef.current >= requiredHits) {
      // Complete current stroke!
      const nextCompleted = [...completedStrokes, activeStrokeIdx];
      setCompletedStrokes(nextCompleted);
      sounds.playSuccess();

      if (nextCompleted.length >= totalStrokes) {
        // Entire letter is completed!
        setIsCompleted(true);
        sounds.playSparkle();
        sounds.speak(`Awesome! You traced letter ${letterKey}!`);

        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}

        if (onComplete) onComplete();
      } else {
        // Move to next stroke in the letter
        const nextStroke = activeStrokeIdx + 1;
        setActiveStrokeIdx(nextStroke);
        checkpointIdxRef.current = 0;
        strokeHistoryRef.current = [];
        denseWaypointsRef.current = generateDenseWaypoints(letterData.strokes[nextStroke].points, width, height);
        sounds.speak(`Great stroke! Now ${letterData.strokes[nextStroke].instruction}`);
      }

      setTimeout(redrawCanvas, 50);
    }
  };

  const handleClear = () => {
    sounds.playTap();
    resetTracerState();
  };

  const currentInstruction = isCompleted
    ? `Roaring Success! You traced letter ${letterKey} perfectly!`
    : letterData.strokes[activeStrokeIdx]?.instruction || `Trace letter ${letterKey}`;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.tracerCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <Text style={styles.pawIcon}>🐾</Text>
              <Text style={styles.titleText}>Trace Letter {letterKey}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Subtitle guidance */}
          <Text style={[styles.instructionText, offPathWarning && styles.instructionWarning]}>
            {offPathWarning ? 'Stay on the dashed line! 🐾' : currentInstruction}
          </Text>

          {/* Dynamic Progress Stroke Pills */}
          <View style={styles.stepPillsRow}>
            {letterData.strokes.map((stroke, sIdx) => {
              const isDone = completedStrokes.includes(sIdx);
              const isActive = sIdx === activeStrokeIdx && !isCompleted;
              return (
                <View
                  key={sIdx}
                  style={[
                    styles.stepPill,
                    isDone && styles.stepPillDone,
                    isActive && styles.stepPillActive,
                    !isDone && !isActive && styles.stepPillPending,
                  ]}
                >
                  <Text style={[styles.stepPillText, isDone && styles.stepPillTextDone]}>
                    {isDone ? `✓ Stroke ${sIdx + 1}` : `${sIdx + 1}. ${stroke.name}`}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Interactive Canvas */}
          <View style={styles.canvasContainer}>
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              style={{
                width: 300,
                height: 300,
                touchAction: 'none',
                cursor: 'crosshair',
                borderRadius: borderRadius.lg,
              }}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={handleDraw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={handleDraw}
            />

            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedEmoji}>🎉</Text>
                <Text style={styles.completedTitle}>Roaring Success!</Text>
                <Text style={styles.completedStars}>+3 Stars Earned ⭐⭐⭐</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <SquishyButton
              variant="surface"
              size="md"
              onPress={handleClear}
              style={styles.clearBtn}
            >
              🔄 Clear
            </SquishyButton>
            <SquishyButton
              variant="primary"
              size="md"
              onPress={onClose}
              style={styles.doneBtn}
            >
              Done 👍
            </SquishyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 9999,
  },
  tracerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: 18,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pawIcon: {
    fontSize: 22,
  },
  titleText: {
    fontFamily: typography.headlineSm.fontFamily,
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
  },
  instructionText: {
    fontFamily: typography.bodySm.fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: colors.onSurface,
    textAlign: 'center',
    minHeight: 20,
  },
  instructionWarning: {
    color: '#DC2626',
    fontWeight: '900',
  },
  stepPillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  stepPillActive: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  stepPillDone: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  stepPillPending: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  stepPillText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  stepPillTextDone: {
    color: '#065F46',
  },
  canvasContainer: {
    width: 300,
    height: 300,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    position: 'relative',
    overflow: 'hidden',
  },
  completedBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 10,
  },
  completedEmoji: {
    fontSize: 48,
  },
  completedTitle: {
    fontFamily: typography.headlineLgMobile.fontFamily,
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  completedStars: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  clearBtn: {
    flex: 1,
  },
  doneBtn: {
    flex: 1,
  },
});
