const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

const EMPTY400 = 'INVALID REQUEST: Empty body is not allowed.';

// application memory - hashset
// 'id' : 'json object - receipt
let memory = {};

// receipts model functions
// get retailer name - points
function get_retailer_points(name) {
    let points = 0;
    for (let i = 0; i < name.length; i++) {
        nameChar = name.charAt(i);
        checkChar = nameChar.charCodeAt(0);

        if ((checkChar > 47 && checkChar < 58) || (checkChar > 64 && checkChar < 91) || (checkChar > 96 && checkChar <123)) {
            points += 1;
        }
    }
    console.log('RETAILER POINTS: ', points);
    return points;
};

function get_total_points(total) {
    let points = 0;
    if (total % 1 === 0) {
        points = 50;
    }
    else if ((total[-2] + total[-1]) % 25 === 0) {
        points = 25;
    }
    else { 
        points = 0;
    }
    console.log('TOTAL POINTS: ', points);
    return points;
}

function get_item_points(items) {
    let floor = Math.floor((items.length / 2));
    console.log('ITEM POINTS: ', floor);
    return floor;
}

function get_length_points(items) {
    let points = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].shortDescription) {
            let desc = items[i].shortDescription;
            let descLen = desc.length;
            if (descLen % 3 === 0) {
                points += Math.round((descLen * 0.2));
            }
        }
    }
    console.log('LENGTH POINTS: ', points);
    return points;
};

function get_date_points(date, time) {
    let points = 0;
    if (date !== "") {
        if (date % 2 !== 0) {
            points += 6;
        }
    }
    if (time !== "") {
        if (14 <= time <= 16) {
            points += 10;
        } 
    }
    console.log('DATE POINTS: ', points);
    return points;
}

// function for receipt process
function generate_id() {
    let id = "";
    // generate an id
    let first = "";
    for (let i = 0; i < 4; i++) {
        let x = Math.floor(Math.random() * 10);
        first += x.toString();
    }
    let second = "";
    for (let i = 0; i < 4; i++) {
        let ascii = Math.random() * (91-65) + 65;
        let letter = String.fromCharCode(ascii);
        second += letter;
    }
    id = first + "-" + second;
    return id;
};

function check_unique(id, receipt) {
    if (id in memory) {
        return false;
    }
    else {
        memory[id] = receipt;
        console.log('memory: ', memory);
        return true;
    }
};

function get_id(id) {
    if (id in memory) {
        return memory[id];
    }
    else {return false};
}

// receipts controller functions
// GET /receipts/{id}/points
router.get('/:id/points', function (req, res) {
    console.log('param id: ', req.params.id);
    let id_check = get_id(req.params.id);
    if (id_check === false) {
        res.status(404).json({'Error': 'This id does not exist.'});
    }
    
    let incoming = memory[req.params.id];
    console.log('incoming: ', incoming);
    let points = 0;
    let purchaseDate = "";
    let purchaseTime = "";
    if (incoming.purchaseDate) {
        purchaseDate = incoming.purchaseDate;
    };
    if (incoming.purchaseTime) {
        purchaseTime = incoming.purchaseTime;
    };
    if (incoming === null || incoming === undefined || Object.keys(incoming).length === 0) {
        res.status(400).json({'Error': EMPTY400});
    };

    if (incoming.retailer){
        points += get_retailer_points(incoming.retailer);
    };
    if (incoming.total) {
        points += get_total_points(incoming.total);
    };
    if (incoming.items) {
        points += get_item_points(incoming.items);
    };
    if (incoming.purchaseDate && incoming.purchaseTime) {
        points += get_date_points(purchaseDate, purchaseTime);
    };
    if (incoming.items) {
        points += get_length_points(incoming.items);
    };
    
    
    let data = {'points' : points};

    return res.status(200).json(data);
});

router.post('/process', function (req, res) {
    let unique = false;
    let count = 0;
    let id = "";
    while (unique === false && count < 10) {
        console.log('count: ', count);
        id = generate_id();
        console.log('generated id: ', id);
        unique = check_unique(id, req.body);
        count += 1;
    }
    
    if (id === "") {
        res.status(400).json({'Error': 'ID could not be made - try again.'})
    }
    let data = {'id' : id };
    res.status(200).json(data);

});

/* EXPORT */
module.exports = router;