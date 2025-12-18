// Шаблоны генеральных планов для разного количества блоков (в стиле 2ГИС)
import React from 'react';

export const MasterPlanTemplates = {
    1: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            {/* Фон - территория комплекса */}
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="140" width="500" height="70" fill="#9e9e9e" opacity="0.4"/>
            <line x1="250" y1="0" x2="250" y2="350" stroke="#9e9e9e" strokeWidth="40" opacity="0.4"/>

            {/* Зелёные зоны */}
            <ellipse cx="100" cy="80" rx="60" ry="50" fill="#7cb342" opacity="0.5"/>
            <ellipse cx="400" cy="80" rx="60" ry="50" fill="#7cb342" opacity="0.5"/>
            <ellipse cx="100" cy="270" rx="60" ry="50" fill="#7cb342" opacity="0.5"/>
            <ellipse cx="400" cy="270" rx="60" ry="50" fill="#7cb342" opacity="0.5"/>

            {/* Тени для блоков */}
            <defs>
                <filter id="buildingShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блок 1 */}
            <g className="building" data-block="1" filter="url(#buildingShadow)">
                <rect x="190" y="120" width="120" height="110" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="198" y="128" width="104" height="94" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="250" y="185" fontSize="32" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
        </svg>
    ),

    2: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="140" width="500" height="70" fill="#9e9e9e" opacity="0.4"/>

            {/* Зелёные зоны */}
            <ellipse cx="100" cy="80" rx="55" ry="45" fill="#7cb342" opacity="0.5"/>
            <ellipse cx="400" cy="80" rx="55" ry="45" fill="#7cb342" opacity="0.5"/>
            <ellipse cx="250" cy="270" rx="70" ry="55" fill="#7cb342" opacity="0.5"/>

            {/* Тени */}
            <defs>
                <filter id="buildingShadow2" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блок 1 */}
            <g className="building" data-block="1" filter="url(#buildingShadow2)">
                <rect x="100" y="120" width="110" height="100" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="107" y="127" width="96" height="86" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="155" y="180" fontSize="28" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>

            {/* Блок 2 */}
            <g className="building" data-block="2" filter="url(#buildingShadow2)">
                <rect x="290" y="120" width="110" height="100" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="297" y="127" width="96" height="86" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="345" y="180" fontSize="28" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
        </svg>
    ),

    3: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="140" width="500" height="70" fill="#9e9e9e" opacity="0.4"/>
            <line x1="167" y1="0" x2="167" y2="350" stroke="#9e9e9e" strokeWidth="30" opacity="0.4"/>
            <line x1="333" y1="0" x2="333" y2="350" stroke="#9e9e9e" strokeWidth="30" opacity="0.4"/>

            {/* Зелёные зоны */}
            <ellipse cx="83" cy="80" rx="45" ry="40" fill="#7cb342" opacity="0.5"/>
            <ellipse cx="250" cy="270" rx="60" ry="50" fill="#7cb342" opacity="0.5"/>
            <ellipse cx="417" cy="80" rx="45" ry="40" fill="#7cb342" opacity="0.5"/>

            {/* Тени */}
            <defs>
                <filter id="buildingShadow3" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блоки */}
            <g className="building" data-block="1" filter="url(#buildingShadow3)">
                <rect x="40" y="125" width="95" height="90" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="46" y="131" width="83" height="78" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="87.5" y="178" fontSize="26" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
            <g className="building" data-block="2" filter="url(#buildingShadow3)">
                <rect x="202" y="125" width="95" height="90" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="208" y="131" width="83" height="78" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="249.5" y="178" fontSize="26" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
            <g className="building" data-block="3" filter="url(#buildingShadow3)">
                <rect x="365" y="125" width="95" height="90" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="371" y="131" width="83" height="78" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="412.5" y="178" fontSize="26" fontWeight="bold" fill="#5d4e42" textAnchor="middle">3</text>
            </g>
        </svg>
    ),

    4: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="140" width="500" height="70" fill="#9e9e9e" opacity="0.4"/>
            <line x1="250" y1="0" x2="250" y2="350" stroke="#9e9e9e" strokeWidth="40" opacity="0.4"/>

            {/* Зелёная зона в центре */}
            <ellipse cx="250" cy="175" rx="50" ry="45" fill="#7cb342" opacity="0.5"/>

            {/* Тени */}
            <defs>
                <filter id="buildingShadow4" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блоки */}
            <g className="building" data-block="1" filter="url(#buildingShadow4)">
                <rect x="60" y="40" width="85" height="80" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="66" y="46" width="73" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="102.5" y="88" fontSize="24" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
            <g className="building" data-block="2" filter="url(#buildingShadow4)">
                <rect x="355" y="40" width="85" height="80" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="361" y="46" width="73" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="397.5" y="88" fontSize="24" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
            <g className="building" data-block="3" filter="url(#buildingShadow4)">
                <rect x="60" y="230" width="85" height="80" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="66" y="236" width="73" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="102.5" y="278" fontSize="24" fontWeight="bold" fill="#5d4e42" textAnchor="middle">3</text>
            </g>
            <g className="building" data-block="4" filter="url(#buildingShadow4)">
                <rect x="355" y="230" width="85" height="80" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="361" y="236" width="73" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="397.5" y="278" fontSize="24" fontWeight="bold" fill="#5d4e42" textAnchor="middle">4</text>
            </g>
        </svg>
    ),

    5: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="140" width="500" height="70" fill="#9e9e9e" opacity="0.4"/>
            <line x1="167" y1="0" x2="167" y2="350" stroke="#9e9e9e" strokeWidth="30" opacity="0.4"/>
            <line x1="333" y1="0" x2="333" y2="350" stroke="#9e9e9e" strokeWidth="30" opacity="0.4"/>

            {/* Зелёная зона */}
            <ellipse cx="250" cy="270" rx="55" ry="50" fill="#7cb342" opacity="0.5"/>

            <defs>
                <filter id="buildingShadow5" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блоки */}
            <g className="building" data-block="1" filter="url(#buildingShadow5)">
                <rect x="43" y="35" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="48" y="40" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="84" y="82" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
            <g className="building" data-block="2" filter="url(#buildingShadow5)">
                <rect x="209" y="35" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="214" y="40" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="250" y="82" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
            <g className="building" data-block="3" filter="url(#buildingShadow5)">
                <rect x="375" y="35" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="380" y="40" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="416" y="82" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">3</text>
            </g>
            <g className="building" data-block="4" filter="url(#buildingShadow5)">
                <rect x="93" y="237" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="98" y="242" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="134" y="284" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">4</text>
            </g>
            <g className="building" data-block="5" filter="url(#buildingShadow5)">
                <rect x="325" y="237" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="330" y="242" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="366" y="284" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">5</text>
            </g>
        </svg>
    ),

    6: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="140" width="500" height="70" fill="#9e9e9e" opacity="0.4"/>
            <line x1="167" y1="0" x2="167" y2="350" stroke="#9e9e9e" strokeWidth="30" opacity="0.4"/>
            <line x1="333" y1="0" x2="333" y2="350" stroke="#9e9e9e" strokeWidth="30" opacity="0.4"/>

            {/* Зелёная зона */}
            <ellipse cx="250" cy="175" rx="45" ry="40" fill="#7cb342" opacity="0.5"/>

            <defs>
                <filter id="buildingShadow6" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блоки - 2 ряда по 3 */}
            <g className="building" data-block="1" filter="url(#buildingShadow6)">
                <rect x="43" y="35" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="48" y="40" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="84" y="82" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
            <g className="building" data-block="2" filter="url(#buildingShadow6)">
                <rect x="209" y="35" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="214" y="40" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="250" y="82" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
            <g className="building" data-block="3" filter="url(#buildingShadow6)">
                <rect x="375" y="35" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="380" y="40" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="416" y="82" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">3</text>
            </g>
            <g className="building" data-block="4" filter="url(#buildingShadow6)">
                <rect x="43" y="237" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="48" y="242" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="84" y="284" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">4</text>
            </g>
            <g className="building" data-block="5" filter="url(#buildingShadow6)">
                <rect x="209" y="237" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="214" y="242" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="250" y="284" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">5</text>
            </g>
            <g className="building" data-block="6" filter="url(#buildingShadow6)">
                <rect x="375" y="237" width="82" height="78" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="380" y="242" width="72" height="68" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="416" y="284" fontSize="22" fontWeight="bold" fill="#5d4e42" textAnchor="middle">6</text>
            </g>
        </svg>
    ),

    7: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="100" width="500" height="50" fill="#9e9e9e" opacity="0.4"/>
            <rect x="0" y="200" width="500" height="50" fill="#9e9e9e" opacity="0.4"/>
            <line x1="125" y1="0" x2="125" y2="350" stroke="#9e9e9e" strokeWidth="25" opacity="0.4"/>
            <line x1="250" y1="0" x2="250" y2="350" stroke="#9e9e9e" strokeWidth="25" opacity="0.4"/>
            <line x1="375" y1="0" x2="375" y2="350" stroke="#9e9e9e" strokeWidth="25" opacity="0.4"/>

            <defs>
                <filter id="buildingShadow7" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блоки */}
            <g className="building" data-block="1" filter="url(#buildingShadow7)">
                <rect x="38" y="25" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="43" y="30" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="73" y="65" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
            <g className="building" data-block="2" filter="url(#buildingShadow7)">
                <rect x="163" y="25" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="168" y="30" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="198" y="65" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
            <g className="building" data-block="3" filter="url(#buildingShadow7)">
                <rect x="288" y="25" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="293" y="30" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="323" y="65" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">3</text>
            </g>
            <g className="building" data-block="4" filter="url(#buildingShadow7)">
                <rect x="393" y="25" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="398" y="30" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="428" y="65" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">4</text>
            </g>
            <g className="building" data-block="5" filter="url(#buildingShadow7)">
                <rect x="100" y="165" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="105" y="170" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="135" y="205" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">5</text>
            </g>
            <g className="building" data-block="6" filter="url(#buildingShadow7)">
                <rect x="225" y="165" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="230" y="170" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="260" y="205" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">6</text>
            </g>
            <g className="building" data-block="7" filter="url(#buildingShadow7)">
                <rect x="330" y="165" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="335" y="170" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="365" y="205" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">7</text>
            </g>
        </svg>
    ),

    8: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="100" width="500" height="50" fill="#9e9e9e" opacity="0.4"/>
            <rect x="0" y="200" width="500" height="50" fill="#9e9e9e" opacity="0.4"/>
            <line x1="125" y1="0" x2="125" y2="350" stroke="#9e9e9e" strokeWidth="25" opacity="0.4"/>
            <line x1="250" y1="0" x2="250" y2="350" stroke="#9e9e9e" strokeWidth="25" opacity="0.4"/>
            <line x1="375" y1="0" x2="375" y2="350" stroke="#9e9e9e" strokeWidth="25" opacity="0.4"/>

            <defs>
                <filter id="buildingShadow8" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блоки - 2 ряда по 4 */}
            <g className="building" data-block="1" filter="url(#buildingShadow8)">
                <rect x="38" y="25" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="43" y="30" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="73" y="65" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
            <g className="building" data-block="2" filter="url(#buildingShadow8)">
                <rect x="163" y="25" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="168" y="30" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="198" y="65" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
            <g className="building" data-block="3" filter="url(#buildingShadow8)">
                <rect x="288" y="25" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="293" y="30" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="323" y="65" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">3</text>
            </g>
            <g className="building" data-block="4" filter="url(#buildingShadow8)">
                <rect x="393" y="25" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="398" y="30" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="428" y="65" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">4</text>
            </g>
            <g className="building" data-block="5" filter="url(#buildingShadow8)">
                <rect x="38" y="260" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="43" y="265" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="73" y="300" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">5</text>
            </g>
            <g className="building" data-block="6" filter="url(#buildingShadow8)">
                <rect x="163" y="260" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="168" y="265" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="198" y="300" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">6</text>
            </g>
            <g className="building" data-block="7" filter="url(#buildingShadow8)">
                <rect x="288" y="260" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="293" y="265" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="323" y="300" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">7</text>
            </g>
            <g className="building" data-block="8" filter="url(#buildingShadow8)">
                <rect x="393" y="260" width="70" height="65" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="398" y="265" width="60" height="55" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="428" y="300" fontSize="20" fontWeight="bold" fill="#5d4e42" textAnchor="middle">8</text>
            </g>
        </svg>
    ),

    9: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="95" width="500" height="45" fill="#9e9e9e" opacity="0.4"/>
            <rect x="0" y="210" width="500" height="45" fill="#9e9e9e" opacity="0.4"/>
            <line x1="167" y1="0" x2="167" y2="350" stroke="#9e9e9e" strokeWidth="30" opacity="0.4"/>
            <line x1="333" y1="0" x2="333" y2="350" stroke="#9e9e9e" strokeWidth="30" opacity="0.4"/>

            <defs>
                <filter id="buildingShadow9" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блоки - 3x3 сетка */}
            <g className="building" data-block="1" filter="url(#buildingShadow9)">
                <rect x="43" y="18" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="48" y="23" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="74" y="56" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
            <g className="building" data-block="2" filter="url(#buildingShadow9)">
                <rect x="219" y="18" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="224" y="23" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="250" y="56" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
            <g className="building" data-block="3" filter="url(#buildingShadow9)">
                <rect x="395" y="18" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="400" y="23" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="426" y="56" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">3</text>
            </g>
            <g className="building" data-block="4" filter="url(#buildingShadow9)">
                <rect x="43" y="152" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="48" y="157" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="74" y="190" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">4</text>
            </g>
            <g className="building" data-block="5" filter="url(#buildingShadow9)">
                <rect x="219" y="152" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="224" y="157" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="250" y="190" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">5</text>
            </g>
            <g className="building" data-block="6" filter="url(#buildingShadow9)">
                <rect x="395" y="152" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="400" y="157" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="426" y="190" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">6</text>
            </g>
            <g className="building" data-block="7" filter="url(#buildingShadow9)">
                <rect x="43" y="272" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="48" y="277" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="74" y="310" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">7</text>
            </g>
            <g className="building" data-block="8" filter="url(#buildingShadow9)">
                <rect x="219" y="272" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="224" y="277" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="250" y="310" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">8</text>
            </g>
            <g className="building" data-block="9" filter="url(#buildingShadow9)">
                <rect x="395" y="272" width="62" height="60" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="400" y="277" width="52" height="50" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="426" y="310" fontSize="18" fontWeight="bold" fill="#5d4e42" textAnchor="middle">9</text>
            </g>
        </svg>
    ),

    10: ({ blockCount }) => (
        <svg viewBox="0 0 500 350" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="500" height="350" fill="#f5f5f0"/>

            {/* Дороги */}
            <rect x="0" y="100" width="500" height="45" fill="#9e9e9e" opacity="0.4"/>
            <rect x="0" y="205" width="500" height="45" fill="#9e9e9e" opacity="0.4"/>
            <line x1="100" y1="0" x2="100" y2="350" stroke="#9e9e9e" strokeWidth="20" opacity="0.4"/>
            <line x1="200" y1="0" x2="200" y2="350" stroke="#9e9e9e" strokeWidth="20" opacity="0.4"/>
            <line x1="300" y1="0" x2="300" y2="350" stroke="#9e9e9e" strokeWidth="20" opacity="0.4"/>
            <line x1="400" y1="0" x2="400" y2="350" stroke="#9e9e9e" strokeWidth="20" opacity="0.4"/>

            <defs>
                <filter id="buildingShadow10" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Блоки - 2 ряда по 5 */}
            <g className="building" data-block="1" filter="url(#buildingShadow10)">
                <rect x="30" y="25" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="35" y="30" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="59" y="60" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">1</text>
            </g>
            <g className="building" data-block="2" filter="url(#buildingShadow10)">
                <rect x="130" y="25" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="135" y="30" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="159" y="60" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">2</text>
            </g>
            <g className="building" data-block="3" filter="url(#buildingShadow10)">
                <rect x="230" y="25" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="235" y="30" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="259" y="60" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">3</text>
            </g>
            <g className="building" data-block="4" filter="url(#buildingShadow10)">
                <rect x="330" y="25" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="335" y="30" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="359" y="60" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">4</text>
            </g>
            <g className="building" data-block="5" filter="url(#buildingShadow10)">
                <rect x="412" y="25" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="417" y="30" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="441" y="60" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">5</text>
            </g>
            <g className="building" data-block="6" filter="url(#buildingShadow10)">
                <rect x="30" y="270" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="35" y="275" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="59" y="305" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">6</text>
            </g>
            <g className="building" data-block="7" filter="url(#buildingShadow10)">
                <rect x="130" y="270" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="135" y="275" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="159" y="305" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">7</text>
            </g>
            <g className="building" data-block="8" filter="url(#buildingShadow10)">
                <rect x="230" y="270" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="235" y="275" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="259" y="305" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">8</text>
            </g>
            <g className="building" data-block="9" filter="url(#buildingShadow10)">
                <rect x="330" y="270" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="335" y="275" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="359" y="305" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">9</text>
            </g>
            <g className="building" data-block="10" filter="url(#buildingShadow10)">
                <rect x="412" y="270" width="58" height="55" fill="#d4c5b9" stroke="#a08d7e" strokeWidth="2" rx="4"/>
                <rect x="417" y="275" width="48" height="45" fill="none" stroke="#a08d7e" strokeWidth="1" opacity="0.3"/>
                <text x="441" y="305" fontSize="17" fontWeight="bold" fill="#5d4e42" textAnchor="middle">10</text>
            </g>
        </svg>
    )
};
