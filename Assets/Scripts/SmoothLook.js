#pragma strict

var target : Transform;
var spd = 1f;
var targRot : Quaternion;

function Start () {
	
}

function Update () {
    //Alternate method of rotating towards an object, based on https://forum.unity3d.com/threads/smooth-look-at.26141/
    targRot = Quaternion.LookRotation(target.transform.position - transform.position);
       
    transform.rotation = Quaternion.Slerp(transform.rotation, targRot, spd * Time.deltaTime);
}
