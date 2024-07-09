document.addEventListener('DOMContentLoaded', () => {
    const summaryContent = document.getElementById('summary-content');
    const backButton = document.getElementById('back-button');
    const downloadPdfButton = document.getElementById('download-pdf');
    const actions = JSON.parse(localStorage.getItem('actions')) || [];
    const totalTime = localStorage.getItem('totalTime') || '00:00';
    const startTime = localStorage.getItem('startTime') || 'Unbekannt';

    let summaryHtml = `<p><strong>CPR begonnen um:</strong> ${startTime}</p>`;
    summaryHtml += `<p><strong>Gesamte verstrichene Zeit:</strong> ${totalTime}</p>`;
    summaryHtml += '<ul>';

    actions.forEach(action => {
        summaryHtml += `<li>${action.time} - ${action.action} (Uhrzeit: ${action.realTime})</li>`;
    });

    summaryHtml += '</ul>';
    summaryContent.innerHTML = summaryHtml;

    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();
        const filename = `Reanimation_${date}_${time}.pdf`;

        doc.text('Zusammenfassung', 10, 10);
        doc.text(`CPR begonnen um: ${startTime}`, 10, 20);
        doc.text(`Gesamte verstrichene Zeit: ${totalTime}`, 10, 30);

        let yPosition = 40;
        actions.forEach(action => {
            doc.text(`${action.time} - ${action.action} (Uhrzeit: ${action.realTime})`, 10, yPosition);
            yPosition += 10;
        });

        doc.save(filename);
    });
});
