from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments
from datasets import load_dataset

# Load dataset
dataset = load_dataset("text", data_files={"train": "conversations.txt"})

# Load pre-trained GPT-2 model and tokenizer
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token  # Set pad token

# Tokenize the dataset
def tokenize_function(examples):
    tokenized_inputs = tokenizer(
        examples["text"],
        truncation=True,
        max_length=128,
        padding="max_length",
        return_tensors="pt",
    )
    tokenized_inputs["labels"] = tokenized_inputs["input_ids"].clone()
    return tokenized_inputs

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=10,
    per_device_train_batch_size=8,
    save_steps=500,
    logging_steps=100,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
)

# Fine-tune
trainer.train()

# Save the model
model.save_pretrained("./fine-tuned-gpt2")
tokenizer.save_pretrained("./fine-tuned-gpt2")