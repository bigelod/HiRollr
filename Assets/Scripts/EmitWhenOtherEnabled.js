#pragma strict

var part : ParticleSystem;
var obj : GameObject;

var spraying = true;

function Start () {
    part = GetComponent.<ParticleSystem>();
}

function Update () {
    var em = part.emission; //Based on Unity Documentation for ParticleSystem.emission

    if (obj.activeInHierarchy) {
        if (!spraying) {

            em.enabled = true;

            spraying = true;
        }
    }
    else
    {
        if (spraying) {

            em.enabled = false;

            spraying = false;
        }
    }
}
