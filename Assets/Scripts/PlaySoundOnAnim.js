#pragma strict

private var source : AudioSource;

var playSnd = false;
var resetSnd = false;

private var playedSnd = false;

function Start () {
    source = GetComponent.<AudioSource>();
}

function Update () {
    if (playSnd && !playedSnd)
    {
        source.Play();

        playedSnd = true;
    }

    if (resetSnd && !playSnd) {
        playedSnd = false;
    }
}
