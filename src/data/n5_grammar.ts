import type { Grammar } from '../types';

export const n5Grammar: Grammar[] = [
    {
        id: 'g-n5-001',
        pattern: '〜は〜です',
        meaning: 'A adalah B (sopan)',
        usage: 'Digunakan untuk mendeskripsikan atau mengidentifikasi sesuatu. Pola kalimat paling dasar.',
        level: 'N5',
        examples: [
            { sentence: '私は学生です。', meaning: 'Saya adalah pelajar.' },
            { sentence: 'これは本です。', meaning: 'Ini adalah buku.' },
        ]
    },
    {
        id: 'g-n5-002',
        pattern: '〜を〜ます',
        meaning: 'melakukan (penanda objek)',
        usage: 'を menandai objek langsung dari kata kerja.',
        level: 'N5',
        examples: [
            { sentence: 'りんごを食べます。', meaning: 'Saya makan apel.' },
            { sentence: '本を読みます。', meaning: 'Saya membaca buku.' },
        ]
    },
    {
        id: 'g-n5-003',
        pattern: '〜に行きます',
        meaning: 'pergi ke (tempat)',
        usage: 'に menunjukkan tujuan saat menggunakan kata kerja gerakan.',
        level: 'N5',
        examples: [
            { sentence: '学校に行きます。', meaning: 'Saya pergi ke sekolah.' },
            { sentence: '日本に行きます。', meaning: 'Saya pergi ke Jepang.' },
        ]
    },
    {
        id: 'g-n5-004',
        pattern: '〜があります / います',
        meaning: 'ada / memiliki',
        usage: 'あります untuk benda mati, います untuk makhluk hidup.',
        level: 'N5',
        examples: [
            { sentence: '机の上に本があります。', meaning: 'Ada buku di atas meja.' },
            { sentence: '猫がいます。', meaning: 'Ada kucing.' },
        ]
    },
    {
        id: 'g-n5-005',
        pattern: '〜が好きです',
        meaning: 'suka ~',
        usage: 'Menyatakan kesukaan. が menandai hal yang disukai.',
        level: 'N5',
        examples: [
            { sentence: '寿司が好きです。', meaning: 'Saya suka sushi.' },
            { sentence: '日本語が好きです。', meaning: 'Saya suka bahasa Jepang.' },
        ]
    },
    {
        id: 'g-n5-006',
        pattern: '〜たい',
        meaning: 'ingin melakukan ~',
        usage: 'Ditambahkan ke bentuk stem kata kerja untuk menyatakan keinginan.',
        level: 'N5',
        examples: [
            { sentence: '日本に行きたいです。', meaning: 'Saya ingin pergi ke Jepang.' },
            { sentence: '寿司を食べたいです。', meaning: 'Saya ingin makan sushi.' },
        ]
    }
];
