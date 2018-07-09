#pragma strict

var player : PlayerCtrl;
var source : AudioSource;

var triggered = false;
var switched = false;

var chktag = "Spray";

var origObj : GameObject;
var newObj : GameObject;

var useTimer = true;
var waitTime = 2f;

private var wait = 0f;

function Start () {
    wait = waitTime;

    source = GetComponent.<AudioSource>();

    if (player == null) {
        var g : GameObject;

        g = GameObject.FindWithTag("Player");

        player = g.GetComponent.<PlayerCtrl>();
    }

    if (player != null) {
        player.wallReady();
    }
}

function Update () {
    if (triggered && !switched) {
        if (wait <= 0f || !useTimer) {
            newObj.SetActive(true);
            origObj.SetActive(false);

            player.wallComplete();
            source.Play();

            switched = true;
        }
        else {
            wait = wait - 1f * Time.deltaTime;
        }

        triggered = false; //Always reset for next check
    }
}

function OnTriggerEnter(c : Collider) {
    if (c.tag == chktag) {
        triggered = true;
    }
}

function OnTriggerStay(c : Collider) {
    if (c.tag == chktag) {
        triggered = true;
    }
}
