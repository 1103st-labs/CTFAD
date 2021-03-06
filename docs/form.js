function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function digestMessage(message) {
    // Stolen striaght from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
    const msgUint8 = new TextEncoder().encode(message);
    // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     
    // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');     // convert bytes to hex string
    return hashHex;
}

function notify_send(message) {
    let valid_note = document.getElementById("valid_note");
    valid_note.innerHTML = message;
}

function check_change(){
    let sub_element = document.getElementById("sub_but");
    if (sub_element.disabled){
        sub_element.disabled = false;
        sub_element.innerHTML = "Re-Send?";
    }
}

function check_flag() {
    let flag_guess = document.getElementById("flag_guess").value;
    let flag_hash = document.getElementById("flag_hash").innerHTML;
    let username_element = document.getElementById("A1");
    let check_element = document.getElementById("A2");
    let sub_element = document.getElementById("sub_but");
    let email_element = document.getElementById("B1");
    let comment_element = document.getElementById("C1");
    let check_element2 = document.getElementById("A3");
    console.log(flag_hash);
    console.log(flag_guess);
    digestMessage(flag_guess).then(
        (guess_hash) => {
            if (guess_hash == flag_hash.trim()){
                notify_send("✓");
                username_element.classList.remove("d-none");
                check_element.classList.remove("d-none");
                sub_element.classList.remove("d-none");
                check_element2.classList.remove("d-none");
                console.log(guess_hash);
            } else {
                notify_send("✕");
                username_element.classList.add("d-none");
                check_element.classList.add("d-none");
                sub_element.classList.add("d-none");
                email_element.classList.add("d-none");
                check_element2.classList.add("d-none");
                comment_element.classList.add("d-none");
                console.log(guess_hash);
            }
        }
    ).catch(
        (error) => {
            notify_send('?');
        }
    );
    check_change();
}

function check_comment(){
    let comment_element = document.getElementById("C1");
    let check_element2 = document.getElementById("do_comment");
    if (check_element2.checked){
        comment_element.classList.remove("d-none");
    } else {
        comment_element.classList.add("d-none");
    }
    check_change();
}

function check_reg(){
    let email_element = document.getElementById("B1");
    let check_element = document.getElementById("do_register");
    if (check_element.checked){
        email_element.classList.remove("d-none");
    } else {
        email_element.classList.add("d-none");
    }
    check_change()
}

function send_request(){
    let comment = encodeURI(document.getElementById("comment").value || "No Comment");
    let flag = encodeURI(document.getElementById("flag_guess").value);
    let username = encodeURI(document.getElementById("username").value);
    let email = encodeURI(document.getElementById("email").value);
    let sub_element = document.getElementById("sub_but");
    if (email){
        let url = `https://docs.google.com/forms/d/e/1FAIpQLSe-eyt3GddBq6GIMglAvKpdKP_WZcoLsCSE-VovK0ZvOkgBwA/formResponse?usp=pp_url&entry.308311016=${email}&entry.662606994=${username}`;
        fetch(url, {mode: 'no-cors'}).then(
            (res) => {
                if (false){
                    sub_element.innerHTML = `ERR: ${res.status}`;
                } else {
                    sub_element.innerHTML = "SENT";
                    sub_element.disabled = true;
                }
            }
        ).catch(
            (res) => {
                sub_element.innerHTML = "ERR: ?";
                sub_element.disabled = true;
                sleep(100);
                sub_element.disabled = false;
            }
        );
    }
    let url = `https://docs.google.com/forms/d/e/1FAIpQLSee4N57o4TtSlqtkouN9QlhDripHWae5u46D8luvNDd27XKNQ/formResponse?usp=pp_url&entry.1884353497=${flag}&entry.337349188=${username}&entry.1882530921=${comment}`;
    fetch(url, {mode: "no-cors"}).then(
        (res) => {
            if (false){
                sub_element.innerHTML = `ERR: ${res.status}`;
            } else {
                sub_element.innerHTML = "SENT";
                sub_element.disabled = true;
            }
        }
    ).catch(
        (res) => {
            sub_element.innerHTML = "ERR: ?";
            sub_element.disabled = true;
            sleep(100);
            sub_element.disabled = false;
        }
    );
}
