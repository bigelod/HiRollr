import UnityEngine.UI;

#pragma strict

private var rb : Rigidbody;
var anim : Animator;
var animState: AnimatorStateInfo;

var sprayCan : GameObject;
var leftFootSparks : GameObject;
var rightFootSparks : GameObject;

var railOff : Vector3;

var spd = 10;
var maxSpd = 20f;
var animMult = 10;
var revMult = 0.5f;
var turnspd = 1;
var jumpspd = 1;
var friction = 0.1f;
var grindSpd = 10f;

var onGround = false;
var doingGrind = false;
private var wasDoingGrind = false;

var currRail : Transform;
var currRailBox : BoxCollider;
var endPos : Vector3;
var startPos : Vector3;

var grindDir = 1; //Grind which direction?
var grindTimeout = 1f; //How many seconds before timing out

private var grindTimer = 0f; //How much time grinding?

var loadscreen : GameObject;

//Loading screen delay
var startTime = 3f;
private var startTimer = 0f;

//HUD stuff
var wallTextObj : GameObject;
var wallText : Text;

var numWallsToPaint = 0;
var numWallsPainted = 0;

function Start () {
    rb = GetComponent.<Rigidbody>();
    loadscreen.SetActive(true);
    wallTextObj.SetActive(false);

    startTimer = startTime;
}

function Update() {
    if (startTimer <= 0f) {
        if (loadscreen.activeInHierarchy) loadscreen.SetActive(false);
        if (!wallTextObj.activeInHierarchy) wallTextObj.SetActive(true);
        
        wallText.text = "Tags: " + numWallsPainted + " / " + numWallsToPaint;

        if (numWallsPainted >= numWallsToPaint) {
            wallText.text = wallText.text + " DONE!";
        }

        animState = anim.GetCurrentAnimatorStateInfo(0);

        var spray = Input.GetButton("Spray");
    
        if (onGround && !doingGrind) {
            anim.SetBool("Spray", spray);
        }
        else 
        {
            anim.SetBool("Spray", false);
        }

        if (animState.IsTag("spray")) {
            sprayCan.SetActive(true);
        }
        else {
            sprayCan.SetActive(false);
        }

        if (doingGrind && onGround && currRail != null && currRailBox != null) {
            anim.SetBool("Grind", true);
            wasDoingGrind = true;
        } else {
            transform.eulerAngles = Vector3(0f, transform.eulerAngles.y, 0f); //Reset to normal so we aren't "tilted"
            currRail = null;
            currRailBox = null;
            anim.SetBool("Grind", false);
        }

        if (grindTimer <= 0f) {
            doingGrind = false; //Looks like we've been a long time gone from the rails!
        } else {
            grindTimer = grindTimer - 1f * Time.deltaTime; //Decrease timeout
        }

        if (doingGrind || animState.IsName("Grind")) {
            leftFootSparks.SetActive(true);
            rightFootSparks.SetActive(true);
        }
        else {
            leftFootSparks.SetActive(false);
            rightFootSparks.SetActive(false);
            grindDir = 0f; //Check again next time we grind
        }
    } 
    else
    {
            startTimer -= 1f * Time.deltaTime;
    }
}

function FixedUpdate () {
    if (startTimer <= 0f) {
        animState = anim.GetCurrentAnimatorStateInfo(0);

        var x = Input.GetAxis("Horizontal");
        var y = Input.GetAxis("Vertical");
        var jump = Input.GetButtonDown("Jump");

        if (y < 0f) y = y * revMult; //Slower reversing

        if (animState.IsName("Grind") && currRail != null && currRailBox != null) {
            endPos = currRail.position + currRail.right * currRail.localScale.x/2f; //The end of the rail
            startPos = currRail.position + (currRail.right * currRail.localScale.x/2f * -1f); //The start of the rail

            if (grindDir == 0f) {
                //We need to pick a direction!
                var angToStart = Mathf.Atan2(startPos.x - transform.position.x, startPos.z - transform.position.z) * Mathf.Rad2Deg;
                var angToEnd = Mathf.Atan2(endPos.x - transform.position.x, endPos.z - transform.position.z) * Mathf.Rad2Deg;
                var myAng = transform.eulerAngles.y;

                //Debug.Log("angToStart: " + angToStart + "  angToEnd: " + angToEnd + "  myAng: " + myAng);

                var railAng = currRail.eulerAngles.y;

                while (railAng > 180) railAng -= 180f;

                //Debug.Log("rail ang: " + currRail.eulerAngles.y + " railAng: " + railAng);

                if (railAng > -90f && railAng < 90f) {
                    if (myAng - angToEnd - railOff.y < 0) {
                        //We're going the normal way!
                        grindDir = 1f;
                    } else {
                        grindDir = -1f;
                    }
                }
                else
                {
                    //Perpendicular rail
                    if (myAng - angToStart - railOff.y < 0) {
                        grindDir = -1f;
                    } else {
                    //We're going the normal way!
                        grindDir = 1f;
                    }
                }
            }

            var extraOff : Vector3;
            if (grindDir == -1) extraOff.y = -180f;
            transform.eulerAngles = currRail.eulerAngles + railOff + extraOff; //Tilt to angle of the rail
            y = 1f; //Force going forward while grinding
            rb.velocity = Vector3(0f,rb.velocity.y,0f) + transform.forward * y * grindSpd;
        } else {
            transform.Rotate(Vector3(0,x * turnspd,0));
            rb.velocity = Vector3(Mathf.Min(maxSpd, rb.velocity.x * friction),rb.velocity.y,Mathf.Min(maxSpd, rb.velocity.z * friction)) + transform.forward * y * spd;
        }

        rb.angularVelocity = rb.angularVelocity * 0.5f; //Stop random spinning

        if (animState.IsName("Grind") && currRail != null && currRailBox != null) {
            //Double check our position to make sure we're not falling out
            //if (!currRailBox.bounds.Contains(transform.position)) {
                transform.position = currRailBox.ClosestPointOnBounds(transform.position);
            //}

        }

        var xzSpd : Vector3;

        xzSpd = new Vector3(rb.velocity.x, 0f, rb.velocity.z);

        if (onGround && jump && !animState.IsName("Jump")) {
            anim.SetTrigger("Jump");
            rb.velocity = rb.velocity + transform.up * jumpspd;
        }

        if (wasDoingGrind && !doingGrind) {
            //Check if we're done a grind
            if (rb.velocity.y > 0.5f && !onGround) {
                anim.SetTrigger("Jump"); //We're "jumping" off the rail
            }

            wasDoingGrind = false;
        }

        if (rb.velocity.y > -0.5f && rb.velocity.y < 0.5f && !animState.IsName("Jump")) {
            onGround = true;
        }
        else
        {
            onGround = false;
        }

        anim.SetFloat("VelocityXZ", xzSpd.magnitude / animMult);

        anim.SetFloat("VelocityY", rb.velocity.y);

        anim.SetBool("OnGround", onGround);

    }
}

function TouchRail(rail : Transform, box : BoxCollider) {
    doingGrind = true;
    currRail = rail;
    currRailBox = box;

    onGround = true;

    grindTimer = grindTimeout; //Reset time since we've last heard from the rails
}

function wallReady() {
    numWallsToPaint += 1;
}

function wallComplete() {
    numWallsPainted += 1;
}