<!-- Navbar -->
<nav id="navbar"
    class="font-semibold font-k2d bg-white shadow-2xl h-[123px] flex items-center justify-between px-5 py-5 xl:px-10 xl:py-10 w-full 
    fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">

    <!-- Menu Burger pour petits écrans -->
    <div class="lg:hidden">
        <button id="burgerMenu" aria-label="Ouvrir le menu" class="text-gray-800 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>
    </div>

    <!-- Partie gauche - Lien principaux -->
    <div class="hidden lg:flex items-center gap-4">
        <?php 
        $links = ['purchase', 'sell', 'rent', 'estimate', 'advisors'];
        foreach ($links as $link) : ?>
            <a href="<?= $translations['navbar']['links'][$link . '_href'] ?>" 
               class="page hover:bg-gradient-text hover:bg-clip-text hover:text-transparent transition-all duration-300">
                <?= $translations['navbar']['links'][$link . '_text'] ?>
            </a>
        <?php endforeach; ?>

        <!-- Lien "Devenez conseiller" -->
        <a href="<?= $translations['navbar']['links']['recrutment_href'] ?>" 
           class="bg-ikami-gradient text-white px-2 py-1 rounded hover:opacity-90">
            <?= $translations['navbar']['links']['recrutment_text'] ?>
        </a>
    </div>

    <!-- Logo au centre -->
    <div class="flex justify-center flex-grow">
        <a href="/">
            <img id="logo" src="/assets/images/logos/ikami.svg"
                 alt="logo" class="h-12 lg:h-14 md:px-3">
        </a>
    </div>

    <!-- Partie droite - Liens secondaires -->
    <div class="hidden lg:flex items-center gap-2">
        <a href="<?= $translations['navbar']['rightLinks']['my_ads_href'] ?>" 
           class="page flex gap-1 items-center hover:bg-gradient-text hover:bg-clip-text hover:text-transparent transition-all duration-300">
            <span class="icon-heart gradient-text text-md"></span> 
            <?= $translations['navbar']['links']['my_ads_text'] ?>
        </a>

        <a href="<?= $translations['navbar']['rightLinks']['about_href'] ?>" 
           class="page hover:bg-gradient-text hover:bg-clip-text hover:text-transparent transition-all duration-300">
            <?= $translations['navbar']['rightLinks']['about_text'] ?>
        </a>

        <!-- Dropdown Sites -->
        <div class="relative p-0.5 rounded-md w-auto gradient">
            <div class="relative z-10 bg-white rounded-md p-1">
                <a href="#" data-dropdown="sites" class="page block bg-white p-1 flex items-center gap-2 rounded hover:text-orange-500">
                    <?= $translations['navbar']['dropdowns']['sites_title'] ?>
                    <span class="icon-chevron"></span>
                </a>
                <div class="absolute z-20 bg-white shadow-lg mt-2 rounded dropdown-custom dropdown-sites hidden">
                    <a href="<?= $translations['navbar']['dropdowns']['sites_incentivy_href'] ?>" 
                       target="<?= $translations['navbar']['dropdowns']['sites_incentivy_target'] ?>" 
                       class="block px-4 py-2 hover:bg-gray-200 gradient-text">
                        <?= $translations['navbar']['dropdowns']['sites_incentivy_text'] ?>
                    </a>
                    <a href="<?= $translations['navbar']['dropdowns']['sites_fondation_href'] ?>" 
                       class="block px-4 py-2 hover:bg-gray-200">
                        <?= $translations['navbar']['dropdowns']['sites_fondation_text'] ?>
                    </a>
                </div>
            </div>
        </div>

        <!-- Dropdown Pays -->
        <div class="relative group">
            <a data-dropdown="countries" class="rounded-[10px] bg-white p-2 hover:text-orange-500 flex items-center gap-2 cursor-pointer">
                <?= $translations['navbar']['dropdowns']['countries_title'] ?>
                <span class="icon-chevron"></span>
            </a>
            <div class="absolute z-20 hidden bg-white shadow-lg mt-2 rounded dropdown-custom dropdown-countries">
                <?php 
                $countries = ['espagne', 'suisse', 'france'];
                foreach ($countries as $country) : ?>
                    <a href="<?= $translations['navbar']['dropdowns']['countries_' . $country . '_href'] ?>" 
                       target="<?= $translations['navbar']['dropdowns']['countries_' . $country . '_target'] ?>" 
                       class="block px-4 py-2 hover:bg-gray-200">
                        <?= $translations['navbar']['dropdowns']['countries_' . $country . '_text'] ?>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</nav>

<!-- Menu déroulant Mobile -->
<div id="mobileMenu" class="lg:hidden hidden fixed left-0 right-0 flex flex-col space-y-4 px-10 py-5 bg-white font-bold shadow-lg z-50">
    <?php foreach ($translations['navbar']['links'] as $key => $link) :
        if (strpos($key, '_text') !== false): 
            $hrefKey = str_replace('_text', '_href', $key);
    ?>
        <a href="<?= $translations['navbar']['links'][$hrefKey] ?>" class="hover:bg-gradient-text hover:bg-clip-text hover:text-transparent transition-all duration-300">
            <?= $link ?>
        </a>
    <?php endif; endforeach; ?>

    <!-- Dropdown Sites Mobile -->
    <div class="relative group">
        <a data-dropdown="sites" class="block bg-white p-2 flex items-center gap-2 rounded hover:text-orange-500 cursor-pointer">
            <?= $translations['navbar']['dropdowns']['sites_title'] ?>
            <span class="icon-chevron"></span>
        </a>
        <div class="mt-2 dropdown-custom dropdown-sites hidden">
            <a href="<?= $translations['navbar']['dropdowns']['sites_incentivy_href'] ?>" target="<?= $translations['navbar']['dropdowns']['sites_incentivy_target'] ?>" 
               class="block px-4 py-2 hover:bg-gray-200 gradient-text">
                <?= $translations['navbar']['dropdowns']['sites_incentivy_text'] ?>
            </a>
            <a href="<?= $translations['navbar']['dropdowns']['sites_fondation_href'] ?>" class="block px-4 py-2 hover:bg-gray-200">
                <?= $translations['navbar']['dropdowns']['sites_fondation_text'] ?>
            </a>
        </div>
    </div>

    <!-- Dropdown Pays Mobile -->
    <div class="relative group">
        <a data-dropdown="countries" class="rounded-[10px] bg-white p-2 hover:text-orange-500 flex items-center gap-2 cursor-pointer">
            <?= $translations['navbar']['dropdowns']['countries_title'] ?>
            <span class="icon-chevron"></span>
        </a>
        <div class="hidden mt-2 dropdown-custom dropdown-countries">
            <?php foreach (['espagne', 'suisse', 'france'] as $pays): ?>
                <a href="<?= $translations['navbar']['dropdowns']["countries_{$pays}_href"] ?>" target="<?= $translations['navbar']['dropdowns']["countries_{$pays}_target"] ?>" 
                   class="block px-4 py-2 hover:bg-gray-200">
                    <?= $translations['navbar']['dropdowns']["countries_{$pays}_text"] ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const navbar = document.getElementById("navbar");
        const logo = document.getElementById("logo");
        const body = document.body;
        const subHeader = document.getElementById("subHeader");
        const mobileMenu= document.getElementById("mobileMenu");
        
        function adjustPadding() {
            if (window.scrollY > 50) {
                navbar.classList.add("h-[70px]", "py-4", "shadow-lg", "text-sm");
                navbar.classList.remove("h-[123px]", "py-10", "text-base");
                mobileMenu.classList.add("top-[70px]", "py-4", "shadow-lg", "text-sm");
                mobileMenu.classList.remove("top-[123px]", "py-10", "text-base");

                logo.classList.add("h-8", "lg:h-10");
                logo.classList.remove("h-12", "lg:h-16");

                body.style.paddingTop = "70px";

                if (subHeader) {
                    subHeader.classList.remove("top-[123px]");
                    subHeader.classList.add("top-[70px]");
                }

            } else {
                navbar.classList.add("h-[123px]", "py-10", "text-base");
                navbar.classList.remove("h-[70px]", "py-4", "shadow-lg", "text-sm");
                mobileMenu.classList.add("top-[123px]", "py-4", "shadow-lg", "text-sm");
                mobileMenu.classList.remove("top-[70px]", "py-10", "text-base");

                logo.classList.add("h-12", "lg:h-16");
                logo.classList.remove("h-8", "lg:h-10");

                body.style.paddingTop = "123px";

                if (subHeader) {
                    subHeader.classList.remove("top-[70px]");
                    subHeader.classList.add("top-[123px]");
                }
            }
        }

        window.addEventListener("scroll", adjustPadding);
        adjustPadding();

        // Gestion du menu burger
        const burgerMenu = document.getElementById("burgerMenu");

        if (burgerMenu && mobileMenu) {
            burgerMenu.addEventListener("click", function() {
                mobileMenu.classList.toggle("hidden");
            });
        }

        // Fonction générique pour gérer les dropdowns
        function setupDropdown(toggleSelector, dropdownSelector) {
            document.querySelectorAll(toggleSelector).forEach(toggle => {
                const dropdown = toggle.nextElementSibling;

                if (dropdown) {
                    toggle.addEventListener("click", function(event) {
                        event.preventDefault();
                        event.stopPropagation();

                        // Ferme tous les autres dropdowns
                        document.querySelectorAll(dropdownSelector).forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.add("hidden");
                                otherDropdown.previousElementSibling.querySelector(".icon-chevron")?.classList.remove("rotate-180");
                            }
                        });

                        dropdown.classList.toggle("hidden");

                        // Gérer l'icône du chevron
                        const chevron = toggle.querySelector(".icon-chevron");
                        if (chevron) {
                            chevron.classList.toggle("rotate-180");
                        }
                    });
                }
            });

            // Ferme les dropdowns si on clique ailleurs
            document.addEventListener("click", function(event) {
                document.querySelectorAll(dropdownSelector).forEach(dropdown => {
                    if (!dropdown.contains(event.target) && !dropdown.previousElementSibling.contains(event.target)) {
                        dropdown.classList.add("hidden");
                        dropdown.previousElementSibling.querySelector(".icon-chevron")?.classList.remove("rotate-180");
                    }
                });
            });
        }

        // Appliquer aux dropdowns (desktop et mobile)
        setupDropdown("[data-dropdown='sites']", ".dropdown-sites");
        setupDropdown("[data-dropdown='countries']", ".dropdown-countries");
                                
    const links = document.querySelectorAll(".page"); // Sélectionne tous les liens du menu
    const mobileLinks = document.querySelectorAll("#mobileMenu a"); // Sélectionne les liens du menu mobile
    const currentPath = window.location.pathname; // Récupère l'URL actuelle

    function activateLink(linkElements) {
        linkElements.forEach(link => {
            if (link.getAttribute("href") === currentPath) {
                link.classList.add("gradient-text");
            } else {
                link.classList.remove("gradient-text");
            }
        });
    }

    activateLink(links);  // Active le lien correspondant dans la navbar
    activateLink(mobileLinks);  // Active le lien correspondant dans le menu mobile
    });
</script>