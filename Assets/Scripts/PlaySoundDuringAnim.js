#pragma strict

private var source : AudioSource;

var anim : Animator;
var animState: AnimatorStateInfo;

var animName = "Grind";
var animTag = "";

function Start () {
    if (anim == null) anim = GetComponent.<Animator>();

    source = GetComponent.<AudioSource>();
}

function Update () {
    animState = anim.GetCurrentAnimatorStateInfo(0);

    if ((animName != "" && animState.IsName(animName)) || (animTag != "" && animState.IsTag(animTag))) {
        //Play our sound!
        if (!source.isPlaying) {
            source.Play();
        }
    }
    else {
        //Otherwise nope!
        if (source.isPlaying) {
            source.Pause();
        }
    }
}
