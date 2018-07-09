#pragma strict

var target : Transform;
var offset : Vector3;
var pitchOff  = 0f;
var lerp = 1f;
var skipMove = false;

var lastTargetPos : Vector3;

function Start () {
    lastTargetPos = target.position + offset;
}

function LateUpdate () {

    var tryPos : Vector3; //Temp variable

    tryPos = target.position + offset; //Our target position is the target object + offset

    if (!skipMove) {
        transform.position = getVLerp(transform.position, tryPos, lerp * Time.deltaTime); //Position at the new linear interpolated position

        transform.LookAt(target); //Look at the target
    }

    if (skipMove) {
        var actPos : Vector3;

        actPos = getVLerp(lastTargetPos, target.position + offset, lerp * Time.deltaTime);

        transform.LookAt(actPos);

        lastTargetPos = actPos;
    }

    transform.Rotate(-1f * pitchOff, 0f, 0f); //Apply our pitch offset, negative so it matches the in-Unity value roughly
}

function getVLerp(start : Vector3, end : Vector3, t : float) {
    //Takes in a start and end position and a lerp value (between 0 and 1) to position between them
    var Ans : Vector3;

    if (t > 1.0) t = 1.0;
    Ans.x = start.x + (end.x - start.x) * t;
    Ans.y = start.y + (end.y - start.y) * t;
    Ans.z = start.z + (end.z - start.z) * t;

    return Ans;
}
