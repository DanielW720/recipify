from django.core.management.base import BaseCommand
from recipify_core.models import Recipe


class Command(BaseCommand):
    help = 'Deletes all Recipe objects'

    def handle(self, *args, **kwargs):
        confirm = input(
            "Are you sure you want to delete all Recipe objects? Type 'yes' to confirm: ")
        if confirm == 'yes':
            self.stdout.write(self.style.WARNING(
                'Deleting all Recipe objects...'))
            response = Recipe.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(
                'Successfully deleted all Recipe objects: %s' % str(response)))
        else:
            self.stdout.write(self.style.WARNING('Operation canceled.'))
