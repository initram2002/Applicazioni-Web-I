function ex0(strings) {
    for (let str of strings) {
        if (str.length < 2)
            console.log("")
        else
            console.log(str.slice(0, 2) + str.slice(str.length - 2, str.length))
    }
}

ex0(["spring", "it", "cat"])