document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('mouseover', function () {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'scale(1.2)';
        });

        link.addEventListener('mouseout', function () {
            this.style.transform = 'scale(1)';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tablinks = document.querySelectorAll('.tablink');

    tablinks.forEach(tab => {
        tab.addEventListener('click', function() {
            const sectionId = this.getAttribute('onclick').match(/'(.*?)'/)[1];

            document.querySelectorAll('.tabcontent').forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });

            tablinks.forEach(link => {
                link.classList.remove('active-tab');
            });

            document.getElementById(sectionId).style.display = 'block';
            document.getElementById(sectionId).classList.add('active');
            this.classList.add('active-tab');
        });
    });

});
