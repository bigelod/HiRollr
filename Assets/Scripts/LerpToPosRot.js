#pragma strict

var target : Transform;
var copyRot = true;
var lerp = 1f;

function Start () {
	
}

function LateUpdate () {
	
    transform.position = getVLerp(transform.position, target.position, lerp * Time.deltaTime); //Position at the new linear interpolated position

    if (copyRot) {
        transform.eulerAngles = target.eulerAngles;
    }
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