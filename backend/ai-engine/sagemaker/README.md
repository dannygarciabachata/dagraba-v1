# Da Graba Studio — AWS SageMaker MusicGen Setup

## Archivos en este directorio

| Archivo | Descripción |
|---------|-------------|
| `deploy_musicgen.py` | Despliega `facebook/musicgen-large` en SageMaker Async Endpoint |
| `inference.py` | Handler que corre DENTRO del container de SageMaker (GPU) |
| `client.py` | Cliente que usa Cloud Run para invocar SageMaker |
| `configure_autoscaling.py` | Scale-to-zero (0-2 instancias) |
| `requirements.txt` | Dependencias del container SageMaker |

## Setup Rápido

### 1. Instalar AWS CLI
```bash
brew install awscli
aws configure
# Access Key, Secret Key, Region: us-east-1
```

### 2. Instalar SageMaker SDK
```bash
pip install sagemaker boto3
```

### 3. Desplegar el Endpoint
```bash
cd backend/ai-engine/sagemaker
python deploy_musicgen.py
```
> ⏱ Toma ~5-10 minutos. Necesita un IAM Role con permisos de SageMaker + S3.

### 4. Configurar Auto-Scaling
```bash
python configure_autoscaling.py
```

### 5. Activar en Cloud Run
Añadir estas env vars al servicio Cloud Run:
```
USE_SAGEMAKER=true
AWS_ACCESS_KEY_ID=<tu-key>
AWS_SECRET_ACCESS_KEY=<tu-secret>
AWS_DEFAULT_REGION=us-east-1
SAGEMAKER_ENDPOINT_NAME=dagraba-musicgen-large-async
```

## Cómo Funciona

```
Frontend → Cloud Run (/generate) → SageMaker Async → S3 (.wav) → Presigned URL → Frontend
```

El routing es automático: si `USE_SAGEMAKER=true`, usa GPU de SageMaker.
Si no, usa el engine local (modo desarrollo).
