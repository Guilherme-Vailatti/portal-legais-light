let obrigacoesMap = {}; // chave: "YYYY-MM-DD", valor: descrição

document.addEventListener("DOMContentLoaded", function () {
    const calendarDays = document.getElementById("calendarDays");
    const monthYear = document.getElementById("monthYear");
    const modal = document.getElementById("modal");
    const modalDate = document.getElementById("modalDate");
    const modalInfo = document.getElementById("modalInfo");
    const closeModal = document.querySelector(".close");

    let currentDate = new Date();
    let selectedDate = null;

    function updateMonthYear() {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }

    function generateCalendar() {
        calendarDays.innerHTML = "";

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();

        for (let i = 0; i < startDay; i++) {
            const emptyDiv = document.createElement("div");
            calendarDays.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            dayDiv.textContent = day;

            const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            if (obrigacoesMap[dateKey]) {
                dayDiv.classList.add("has-obligation");
            }

            dayDiv.addEventListener("click", function () {
                selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                openModal(day);
            });

            calendarDays.appendChild(dayDiv);
        }
    }

    function openModal(day) {
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateString = `${String(day).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

        modalDate.textContent = `Data: ${dateString}`;
        const descricao = obrigacoesMap[dateKey];

        if (descricao) {
            const itens = descricao.split(/\n+/);
            const listaHTML = "<ul>" + itens.map(item => `<li>${item.trim()}</li>`).join("") + "</ul>";
            modalInfo.innerHTML = listaHTML;
        } else {
            modalInfo.textContent = "Nenhuma obrigação para este dia.";
        }

        modal.style.display = "flex";
    }

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

   // Close modal when clicking outside the modal content
    modal.addEventListener("click", function(event) {
        // Check if the click was on the modal background (not on the modal content)
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

 


    document.getElementById("nextMonth").addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById("prevMonth").addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    function loadObrigacoes(ano, mes) {
        const mesFormatado = String(mes).padStart(2, '0');
        const filePath = `data/obrigacoes_${ano}-${mesFormatado}.json`;

        return fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error("Arquivo não encontrado");
                return response.json();
            })
            .then(data => {
                obrigacoesMap = {};
                data.forEach(item => {
                    obrigacoesMap[item.data] = item.descricao;
                });
            })
            .catch(error => {
                console.warn(`Sem obrigações para ${mesFormatado}/${ano}`);
                obrigacoesMap = {};
            });
    }

    function renderCalendar() {
        loadObrigacoes(currentDate.getFullYear(), currentDate.getMonth() + 1).then(() => {
            updateMonthYear();
            generateCalendar();
        });
    }

    renderCalendar();
});
