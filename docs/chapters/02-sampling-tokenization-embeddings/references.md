# References: Sampling, Tokenization, and Embeddings

1. [Byte pair encoding](https://en.wikipedia.org/wiki/Byte_pair_encoding) - Wikipedia - Detailed explanation of the BPE algorithm including merge rules, vocabulary construction, and worked examples. The single most important Wikipedia article for understanding why English and code tokenize so differently.

2. [Word embedding](https://en.wikipedia.org/wiki/Word_embedding) - Wikipedia - Coverage of dense vector representations, training methods, and properties of the embedding space; foundation for the RAG and semantic-search material in Chapter 15.

3. [Lexical analysis](https://en.wikipedia.org/wiki/Lexical_analysis) - Wikipedia - Broader CS context for tokenization including pre-tokenization, special tokens, and Unicode handling — useful for understanding the per-vendor tokenizer drift discussed in this chapter.

4. Natural Language Processing with Transformers (Revised Edition) - Lewis Tunstall, Leandro von Werra, and Thomas Wolf - O'Reilly - Chapter 4 on tokenizers gives an end-to-end implementation perspective; the book is co-authored by Hugging Face engineers who built the tools used in this chapter's examples.

5. Hands-On Large Language Models - Jay Alammar and Maarten Grootendorst - O'Reilly - Chapter 2 covers tokenization with side-by-side comparisons across vendors; Chapter 4 covers embeddings with the geometric intuition needed for RAG.

6. [tiktoken GitHub Repository](https://github.com/openai/tiktoken) - OpenAI - The official OpenAI tokenizer library used throughout this chapter's code examples; README explains encoding models and gives count-tokens recipes.

7. [Hugging Face Tokenizers Documentation](https://huggingface.co/docs/tokenizers/index) - Hugging Face - Reference for the fast Rust-backed tokenizer library; useful for engineers comparing tokenizer behavior across model families.

8. [The Illustrated Word2vec](https://jalammar.github.io/illustrated-word2vec/) - Jay Alammar - Visual blog post explaining how words become vectors; the most accessible introduction to the embedding-space concept used in this chapter and Chapter 15.

9. [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings) - OpenAI - Authoritative reference for embedding model APIs, dimensions, and use cases; the canonical source for the embedding cost-and-dimension numbers used in this chapter.

10. [Neural Machine Translation of Rare Words with Subword Units](https://arxiv.org/abs/1508.07909) - Sennrich, Haddow, Birch (arXiv) - The original 2016 paper introducing BPE for NLP; short (10 pages) and worth reading once for engineers who want the primary-source treatment of the algorithm.
