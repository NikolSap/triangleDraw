//קליטת הנקודות
function createTreangle(){
     function parsePoint(id){
        const val = document.getElementById(id).value;
        const parts = val.split(",");
        return { x: parseFloat(parts[0]), y: parseFloat(parts[1]) };
    }

    const points = {
        A: parsePoint("A"),
        B: parsePoint("B"),
        C: parsePoint("C")
    };

    localStorage.setItem("trianglePoints", JSON.stringify(points));
    window.location.href = "display.html";
}

//עבודה עם הקאנבה ליצירת המשולש
var canvasElement = document.querySelector("#myCanvas");
var ctx = canvasElement.getContext("2d");

const width = canvasElement.width;
const height = canvasElement.height;

const stored = localStorage.getItem("trianglePoints");
if(!stored){
    alert("לא נמצאו נקודות!");
} else {
    const points = JSON.parse(stored);
    const A = points.A;
    const B = points.B;
    const C = points.C;

     //יצירת מערכת צירים
    drawAxes(50,ctx);

//יצירת משולש
    drawTriangle(A, B, C);
//יחישוב זוויות לכל נקודה
    const angA = angleAtVertex(B,A,C);
    const angB = angleAtVertex(A,B,C);
    const angC = angleAtVertex(A,C,B);

     //יצירת הנקודה והערך של הזווית על המשולש
    drawVertexWithAngle(A,B,C,"A", angA);
    drawVertexWithAngle(B,A,C,"B", angB);
    drawVertexWithAngle(C,A,B,"C", angC);

     // יצירת הקו של הזווית
    drawAngleArc(A,B,C,30);
    drawAngleArc(B,A,C,30); 
    drawAngleArc(C,A,B,30); 
}



function drawTriangle(A, B, C) {
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#666666';
    ctx.stroke();
    ctx.fillStyle = "#FFCC00";
    ctx.fill();

    [A, B, C].forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, 2*Math.PI);
        ctx.fillStyle = "#000";
        ctx.fill();
    });
}


function angleAtVertex(P1, V, P2){
    const a = Math.hypot(P1.x - P2.x, P1.y - P2.y); 
    const b = Math.hypot(V.x - P2.x, V.y - P2.y);   
    const c = Math.hypot(V.x - P1.x, V.y - P1.y);  

    const cosTheta = (b*b + c*c - a*a) / (2*b*c);
    const theta = Math.acos(Math.min(1, Math.max(-1, cosTheta)));

    return theta * 180 / Math.PI;

}

function drawVertexWithAngle(V, P1, P2, label, angle){
    ctx.beginPath();
    ctx.arc(V.x, V.y, 5, 0, 2*Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();

    ctx.save();
    ctx.scale(1,-1);
    ctx.fillStyle = "#0000FF";
    ctx.font = "16px Arial";


    let labelOffset = {x:-20, y:-5}; 
    if(label==="B") labelOffset = {x:10, y:-25};
    if(label==="C") labelOffset = {x:20, y:20};
    ctx.fillText(label, V.x + labelOffset.x, -V.y + labelOffset.y);

    let angleOffset = {x:30, y:-10};
    if(label==="B") angleOffset = {x:15, y:20};
    if(label==="C") angleOffset = {x:1, y:-1};
    ctx.fillStyle = "#FF0000";
    ctx.font = "bold 16px Arial";
    ctx.fillText(angle.toFixed(1)+"°", V.x + angleOffset.x, -V.y + angleOffset.y);
    ctx.restore();

    drawAngleArc(V, P1, P2, 30);
}


function drawAngleArc(V, P1, P2, radius){
    const a = {x: P1.x - V.x, y: P1.y - V.y};
    const b = {x: P2.x - V.x, y: P2.y - V.y};

    const magA = Math.hypot(a.x,a.y);
    const magB = Math.hypot(b.x,b.y);
    const ua = {x: a.x/magA, y: a.y/magA};
    const ub = {x: b.x/magB, y: b.y/magB};

    const steps = 20;
    ctx.beginPath();
    for(let i=0; i<=steps; i++){
        const t = i/steps;
        const x = V.x + radius*(ua.x*(1-t) + ub.x*t);
        const y = V.y + radius*(ua.y*(1-t) + ub.y*t);
        if(i===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
    }

    ctx.strokeStyle = "#585858a3";
    ctx.lineWidth = 2;
    ctx.stroke();
}


function drawAxes(gridSize=50,ctx){
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";

    ctx.translate(50, height - 50); 
    ctx.scale(1, -1); 

    for(let x=0; x<=width-100; x+=gridSize){
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,height-100);
        ctx.stroke();
        ctx.save();
        ctx.scale(1,-1); 
        ctx.fillText(x, x-5, -5);
        ctx.restore();
    }

    for(let y=0; y<=height-100; y+=gridSize){
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(width-100,y);
        ctx.stroke();
        ctx.save();
        ctx.scale(1,-1);
        ctx.fillText(y, -25, -y+3);
        ctx.restore();
    }

    
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(width-100,0);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,height-100);
    ctx.stroke();
}


function goBack() {
    window.location.href = "input.html";

}
