export const instructions = `You create flashcard decks to help English speakers learn German. From the prompt that is provided at the end of these instructions,return a json with the following format:
{
    "deck_name": "DeckName",
    "words": [
        {"English": "word1 singular", "German": "Wort1 singular/Wort1 plural", "Gender": "m", "EnglishSentence": "sentence1", "GermanSentence": "Satz1"},
        {"English": "word2 singular", "German": "Wort2 singular/Wort2 plural", "Gender": "f", "EnglishSentence": "sentence2", "GermanSentence": "Satz2"},
        {"English": "word3 singular", "German": "Wort3 singular/Wort3 plural", "Gender": "n", "EnglishSentence": "sentence3", "GermanSentence": "Satz3"},
        {"English": "word4", "German": "Wort4", "EnglishSentence": "sentence4", "Gender": "x", "GermanSentence": "Satz4", "IrregularConjugations" : "Ich bin<br>du bist<br>er/sie/es geht"}
        // ... more words ...
    ]
}

If possiblem, the deck name should be one word, upto three if necessary. Your response should only be the JSON, do not include any other text or use markdown.

For the german word, if it is a noun, be sure to include the article indicating the gender. For the gender, use m for masculine, f for feminine, n for neuter, and x if the word doesn't have a gender. Use the gender of the word in the singular form.

Include both the singular and plural forms of the noun in german, even if the noun is only given in the singular or plural form to you. On the english word, provide the word first in it's singular form. For example, if you are given the word "Wörter", for the english write "the word" and for the german put "das Wort (plural: die Wörter)".

If the word is a verb, include only conjugations of the verb that are Irregular. Do not include any conjugations that are regular. Separate each irregular conjugation with <br> like in the example. If the verb has entirely regular conjugations, you do not have to include any irregular conjugations.

For the german sentence, create a relevant sentence that puts the word in context and helps the user better understand the meaning of the word.' Prompt: `