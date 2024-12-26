import os

sprites_dir = "./sprites"
output_file = "pokemon_names.txt"

try:
    filenames = [
        f for f in os.listdir(sprites_dir)
        if os.path.isfile(os.path.join(sprites_dir, f)) and f.endswith(".png")
    ]
    with open(output_file, "w") as file:
        for name in filenames:
            file.write(name + "\n")
    print(f"Successfully wrote {len(filenames)} filenames to {output_file}.")
except Exception as e:
    print(f"An error occurred: {e}")