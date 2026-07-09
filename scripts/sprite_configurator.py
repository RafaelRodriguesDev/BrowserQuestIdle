import sys
import json
import os
import argparse
from PIL import Image

def main():
    parser = argparse.ArgumentParser(description="Automatiza a configuração de Sprites do BrowserQuest")
    parser.add_argument("--image", required=True, help="Caminho para o arquivo PNG (Escala x2)")
    parser.add_argument("--template", required=True, help="Caminho para o JSON modelo (contendo animations, lengths e rows)")
    parser.add_argument("--out-json", required=True, help="Onde salvar o novo arquivo JSON gerado")
    parser.add_argument("--out-id", required=True, help="O 'id' a ser injetado no JSON")
    parser.add_argument("--out-image-name", required=True, help="Nome do arquivo de saída de imagem, ex: ratv2.png")
    
    args = parser.parse_args()
    
    # Carregar imagem
    if not os.path.exists(args.image):
        print(f"Erro: Imagem não encontrada: {args.image}")
        sys.exit(1)
        
    try:
        img = Image.open(args.image)
    except Exception as e:
        print(f"Erro ao abrir imagem: {e}")
        sys.exit(1)
        
    width2, height2 = img.size
    print(f"[1] Imagem {args.image} carregada. Dimensões Fator 2: {width2}x{height2}")

    # Carregar template JSON
    if not os.path.exists(args.template):
        print(f"Erro: Template não encontrado: {args.template}")
        sys.exit(1)
        
    try:
        with open(args.template, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Erro ao carregar o JSON: {e}")
        sys.exit(1)
        
    if "animations" not in data:
        print("Erro: Template JSON não tem chave 'animations'.")
        sys.exit(1)
        
    animations = data["animations"]
    
    max_length = 0
    max_row = 0
    
    for anim_name, anim_data in animations.items():
        length = anim_data.get("length", 1)
        row = anim_data.get("row", 0)
        
        if length > max_length:
            max_length = length
        if row > max_row:
            max_row = row
            
    # O total de linhas é max_row + 1
    total_rows = max_row + 1
    
    # Calcular dimensão de um quadro (Fator 2)
    frame_width2 = int(round(width2 / max_length))
    frame_height2 = int(round(height2 / total_rows))
    
    print(f"[2] Max Length: {max_length}, Total Rows: {total_rows}")
    print(f"[3] Frame calculado na imagem orginal (fator 2): {frame_width2}x{frame_height2}")
    
    # O JSON espera o valor do Fator 1
    frame_width1 = frame_width2 // 2
    frame_height1 = frame_height2 // 2
    
    print(f"[4] Frame BASE (Fator 1) para o JSON: {frame_width1}x{frame_height1}")
    
    # Injetar os valores
    data["id"] = args.out_id
    data["width"] = frame_width1
    data["height"] = frame_height1
    
    # Salvar JSON
    try:
        with open(args.out_json, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        print(f"[5] JSON gerado salvo em {args.out_json}")
    except Exception as e:
        print(f"Erro ao salvar JSON: {e}")
        sys.exit(1)
        
    # Salvar imagens (fator 2 e fator 1)
    # A imagem de entrada jé é fator 2, a gente salva na pasta 2
    out_dir_2 = os.path.join("client", "img", "2")
    out_dir_1 = os.path.join("client", "img", "1")
    
    out_path_2 = os.path.join(out_dir_2, args.out_image_name)
    out_path_1 = os.path.join(out_dir_1, args.out_image_name)
    
    try:
        img.save(out_path_2)
        print(f"[6] Imagem de Escala 2 salva em {out_path_2}")
        
        img1 = img.resize((width2 // 2, height2 // 2), Image.Resampling.NEAREST)
        img1.save(out_path_1)
        print(f"[7] Imagem de Escala 1 salva em {out_path_1}")
    except Exception as e:
        print(f"Erro ao salvar as imagens: {e}")
        sys.exit(1)
        
    print("Processo concluído com sucesso!")

if __name__ == "__main__":
    main()
