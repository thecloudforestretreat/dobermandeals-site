"""Neutral South American Spanish vocabulary; preserve accents, claims and URLs.

This locale pass is editorial work, not a claim of human native-language or clinical approval.
Existing slugs/hreflang remain stable. Provider names and source URLs are not translated.
"""
import re

def localize(text):
 if text.startswith(('https://','/')): return text
 replacements=[
  (r'\bdel transportín\b','de la jaula de transporte'),
  (r'\bal transportín\b','a la jaula de transporte'),
  (r'\bel transportín\b','la jaula de transporte'),
  (r'\bun transportín\b','una jaula de transporte'),
  (r'\btransportín\b','jaula de transporte'),
  (r'\badiestramiento\b','entrenamiento'),
  (r'\bapúntate\b','inscríbete'),
  (r'\bos ayudan\b','te ayudan'),
  (r'\bcoches\b','vehículos'),(r'\bcoche\b','vehículo'),
  (r'\bcuencos\b','recipientes'),(r'\bcuenco\b','recipiente'),
  (r'\buna carencia\b','un periodo de espera'),
  (r'\bcarencias\b','periodos de espera'),(r'\bcarencia\b','periodo de espera'),
 ]
 for pattern,replacement in replacements:
  def replace(match):
   return replacement[0].upper()+replacement[1:] if match.group()[0].isupper() else replacement
  text=re.sub(pattern,replace,text,flags=re.IGNORECASE)
 return text

def _walk(value):
 if isinstance(value,str): return localize(value)
 if isinstance(value,list): return [_walk(x) for x in value]
 if isinstance(value,tuple): return tuple(_walk(x) for x in value)
 if isinstance(value,dict): return {k:_walk(v) for k,v in value.items()}
 return value

def apply_locale(copy):
 for variants in copy.values():
  if 'es' in variants: variants['es']=_walk(variants['es'])
