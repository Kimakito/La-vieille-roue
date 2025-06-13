<!-- Footer -->
<footer class="bg-black font-k2d text-white px-5 md:px-28 py-8">
    <section class="container mx-auto gap-12 border-b border-orange-500">
        <div class="w-full flex justify-between">
            <!--logo-->
            <img class="min-w-[200px]" src="../assets/images/logos/ikami_white.svg" alt="Logo ikami" class="mb-4">
        </div>
        <div class="flex items-start gap-8 md:gap-16 py-11">
            <!-- Premier bloc : et informations de contact -->
            <div class="flex flex-wrap gap-5 md:gap-12 text-sm">
                <!-- Contact France -->
                <div>
                    <h4 class="text-orange-500 font-semibold"><span class="text-white">ikami –</span> France</h4>
                    <div class="orange-line-text py-2"></div>
                    <p>1 rue Conrad Killian<br>38950 Saint-Martin-le-Vinoux<br>Tél. : +334 76 95 15 63</p>
                </div>
                <!-- Contact Suisse -->
                <div>
                    <h4 class="text-orange-500 font-semibold"><span class="text-white">ikami –</span> Suisse</h4>
                    <div class="orange-line-text py-2"></div>
                    <p>Place de Longemalle 1<br>1204 Genève<br>Tél. : 078 205 14 61</p>
                </div>
                <!-- Contact Espagne -->
                <div>
                    <h4 class="text-orange-500 font-semibold"><span class="text-white">ikami –</span> Espagne</h4>
                    <div class="orange-line-text py-2"></div>
                    <p>Pl. de Francesc Macià, 3<br>08021 Barcelona<br>Tél. : +34 931 05 8129</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-5 md:gap-28">
                <!-- Deuxième bloc : Navigation -->
                <div class="">
                    <h3 class="font-semibold sm:text-lg text-white"><?= $translations['footer']['navigation_title'] ?></h3>
                    <div class="white-line-text py-2"></div>
                    <div class="flex flex-wrap gap-5 md:gap-20">
                        <ul class="text-sm space-y-2">
                            <li><a href="<?= $translations['footer']['navigation_link_1_url'] ?>" class="hover:text-white"><strong><?= $translations['footer']['navigation_link_1_text'] ?></strong></a></li>
                            <li><a href="<?= $translations['footer']['navigation_link_2_url'] ?>" class="hover:text-white"><?= $translations['footer']['navigation_link_2_text'] ?></a></li>
                            <li><a href="<?= $translations['footer']['navigation_link_3_url'] ?>" class="hover:text-white"><?= $translations['footer']['navigation_link_3_text'] ?></a></li>
                            <li><a href="<?= $translations['footer']['navigation_link_4_url'] ?>" class="hover:text-white"><?= $translations['footer']['navigation_link_4_text'] ?></a></li>
                        </ul>
                        <ul class="text-sm space-y-2">
                            <li><a href=<?= $translations['footer']['navigation_link_5_url'] ?> class="hover:text-white"><?= $translations['footer']['navigation_link_5_text'] ?></a></li>
                            <li><a href=<?= $translations['footer']['navigation_link_6_url'] ?> class="hover:text-white"><?= $translations['footer']['navigation_link_6_text'] ?></a></li>
                            <li><a href=<?= $translations['footer']['navigation_link_7_url'] ?> class="hover:text-white"><?= $translations['footer']['navigation_link_7_text'] ?></a></li>
                            <li><a href=<?= $translations['footer']['navigation_link_8_url'] ?> class="hover:text-white"><?= $translations['footer']['navigation_link_8_text'] ?></a></li>
                        </ul>
                    </div>
                </div>

                <!-- Troisième bloc : Support -->
                <div class="">
                    <h3 class="font-semibold sm:text-lg text-white"><?= $translations['footer']['support_title'] ?></h3>
                    <div class="white-line-text py-2"></div>
                    <ul class="text-sm space-y-2">
                        <li><a href="mes-annonces" class="hover:text-white"><?= $translations['footer']['support_link_1_text'] ?></a></li>
                        <li><a href="contact" class="hover:text-white"><?= $translations['footer']['support_link_2_text'] ?></a></li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
        <!-- Suivez-nous sur les réseaux -->
        <div class="container mx-auto flex flex-col md:flex-row items-center justify-between py-10 border-t border-orange-500">
            <div class="text-center md:text-left">
                <h3 class="text-xl md:text-4xl font-bold mb-4"><?= $translations['footer']['social_title'] ?></h3>
                <p class="text-md md:text-lg mb-6">
                    <?= $translations['footer']['social_subtitle'] ?>
                </p>
            </div>
            <div class="flex gap-8">
                <a href="https://www.instagram.com/ikami_france/" target="blank">
                    <img src="../assets/images/logos/instagram.svg" alt="Instagram" class="w-8 md:w-10">
                </a>
                <a href="https://www.youtube.com/channel/UCfs4oCoEkImWemc7iD1BUMQ" target="blank">
                    <img src="../assets/images/logos/youtube.svg" alt="YouTube" class="w-8 md:w-10">
                </a>
                <a href="https://www.facebook.com/ikamifrance/" target="blank">
                    <img src="../assets/images/logos/facebook.svg" alt="Facebook" class="w-8 md:w-10">
                </a>
                <a href="https://www.linkedin.com/company/ikami-france/posts/?feedView=all" target="blank">
                    <img src="../assets/images/logos/linkedin.svg" alt="LinkedIn" class="w-8 md:w-10">
                </a>
            </div>
        </div>

        <!-- Liens légaux -->
        <div class="container mx-auto text-sm text-gray-400 border-t border-orange-500 p-6">
            <p class="flex flex-wrap gap-4 items-center">
               <a href="<?= $lang == 'fr' ? 'https://ikami.dev/politique-confidentialite' : ($lang == 'es' ? 'https://es.ikami.dev/politica-de-privacidad' : ($lang == 'ch' ? 'https://ch.ikami.dev/politique-confidentialite-ch' : '#')) ?>" 
                    class="text-gray-400 hover:text-white">
                    <?= $translations['footer']['legal_link_1_text'] ?>
                </a>
                <span class="text-orange-500">|</span>
                <a href="<?= $lang == 'fr' ? 'https://ikami.dev/mentions-legales' : ($lang == 'es' ? 'https://es.ikami.dev/menciones-legales' : ($lang == 'ch' ? 'https://ch.ikami.dev/mentions-legales-ch' : '#')) ?>" 
                    class="text-gray-400 hover:text-white">
                    <?= $translations['footer']['legal_link_2_text'] ?>
                </a>
            </p>
    </section>
</footer>