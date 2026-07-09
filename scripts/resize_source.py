from PIL import Image

def resize_image(img_path, out_path, factor=0.4):
    img = Image.open(img_path)
    w, h = img.size
    new_w = int(round(w * factor))
    new_h = int(round(h * factor))
    # Using Resampling.NEAREST to preserve pixel art style
    resized_img = img.resize((new_w, new_h), Image.Resampling.NEAREST)
    resized_img.save(out_path)
    print(f"Resized {img_path} to {new_w}x{new_h} and saved to {out_path}")

if __name__ == "__main__":
    resize_image("client/img/v2/monster/Rat_transparent.png", "client/img/v2/monster/Rat_transparent_small.png", 0.5)
