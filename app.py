import os
from pathlib import Path

def unificar_tudo():
    # Define a pasta atual como ponto de partida
    diretorio_raiz = Path.cwd()
    arquivo_saida = "projeto_completo.txt"
    
    # Extensões que você solicitou
    extensoes_alvo = {'.json', '.md', '.ts', '.js', '.py', '.txt'}
    
    # Pastas que DEVEMOS pular para não poluir o arquivo e nem travar o PC
    pastas_proibidas = {'node_modules', '.git', 'venv', '__pycache__', '.next', 'dist', 'build'}

    print(f"🚀 Iniciando unificação em: {diretorio_raiz}")
    print(f"📂 Filtrando por: {', '.join(extensoes_alvo)}\n")

    arquivos_processados = 0

    with open(arquivo_saida, 'w', encoding='utf-8') as f_out:
        # O rglob('*') navega por TODAS as subpastas infinitamente
        for caminho_arquivo in diretorio_raiz.rglob('*'):
            
            # Verifica se é um arquivo e se a extensão é uma das escolhidas
            if caminho_arquivo.is_file() and caminho_arquivo.suffix.lower() in extensoes_alvo:
                
                # Pula se o arquivo estiver dentro de uma das pastas proibidas
                if any(p in caminho_arquivo.parts for p in pastas_proibidas):
                    continue
                
                # Pula o próprio arquivo de saída para não criar um loop de texto
                if caminho_arquivo.name == arquivo_saida:
                    continue

                try:
                    with open(caminho_arquivo, 'r', encoding='utf-8') as f_in:
                        conteudo = f_in.read()
                        
                        # Escreve o cabeçalho com o caminho relativo (ex: src/components/button.ts)
                        relativo = caminho_arquivo.relative_to(diretorio_raiz)
                        f_out.write(f"\n{'='*60}\n")
                        f_out.write(f"ARQUIVO: {relativo}\n")
                        f_out.write(f"{'='*60}\n\n")
                        
                        f_out.write(conteudo)
                        f_out.write("\n") # Garante quebra de linha entre arquivos
                        
                    print(f"✅ Adicionado: {relativo}")
                    arquivos_processados += 1
                    
                except Exception as e:
                    print(f"⚠️  Pulei o arquivo {caminho_arquivo.name} devido a erro de leitura.")

    print(f"\n✨ Pronto! {arquivos_processados} arquivos foram unificados em '{arquivo_saida}'.")

if __name__ == "__main__":
    unificar_tudo()