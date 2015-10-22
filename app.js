function main() {
  var locks = document.createElement("ul")
  document.body.appendChild(locks)
  locks.classList.add("locks")

  function update(e) {
    var data = JSON.parse(e.data)
    while (locks.firstChild)
      locks.removeChild(locks.firstChild)

    data.forEach(function (d) {
      var lock = document.createElement("li")
      var buttons = document.createElement("div")
      var buttonLock = document.createElement("button")
      var buttonUnlock = document.createElement("button")

      buttons.classList.add("buttons")

      var h = document.createElement("h1")
      h.textContent = d.name

      lock.appendChild(h)

      var span = document.createElement("span")
      span.textContent = d.locked ? "Verschlossen" : "Offen"
      lock.appendChild(span)

      if (d.uncertain) {
  
        var unc = document.createElement("span")
        unc.classList.add("warning")
        unc.textContent = "(ungewiss)"
        lock.appendChild(unc)
      }

      if (d.error != 0) {
        var err = document.createElement("span")
        err.classList.add("error")
        err.textContent = "Fehler: " + d.error
        lock.appendChild(err)
      }

      if (d.battery_low) {
        var bat = document.createElement("span")
        bat.classList.add("error")
        bat.textContent = "Batterie leer!"
        lock.appendChild(bat)
      }

      buttonLock.onclick = function () {
        var url = '/api/lock/' + d.id
        var req = new XMLHttpRequest()

        req.open('PUT', url)
        req.send('lock')
      }

      buttonUnlock.onclick = function () {
        var url = '/api/lock/' + d.id
        var req = new XMLHttpRequest()

        req.open('PUT', url)
        req.send('unlock')
      }

      buttons.appendChild(buttonLock)
      buttons.appendChild(buttonUnlock)
      lock.appendChild(buttons)
      locks.appendChild(lock)

      buttonLock.textContent = "🔒 zu"
      buttonUnlock.textContent = "🔓 auf"
    })
  }

  var door = document.createElement("button")
  door.textContent = "Türöffner betätigen"
  door.onclick = function () {
    var req = new XMLHttpRequest()
    req.open('PUT', '/api/door')
    req.send()
  }

  document.body.appendChild(door)

  var stream = new EventSource('/api/locks/stream')
  stream.onmessage = update
}

main()
