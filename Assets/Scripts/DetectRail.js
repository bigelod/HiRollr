#pragma strict

var chkTag = "Rails";
var tellPlayer : PlayerCtrl;

function OnTriggerEnter(c : Collider) {
    if (c.tag == chkTag) {
        tellPlayer.TouchRail(c.transform, c);
    }
}

function OnTriggerStay(c : Collider) {
    if (c.tag == chkTag) {
        tellPlayer.TouchRail(c.transform, c);
    }
}
